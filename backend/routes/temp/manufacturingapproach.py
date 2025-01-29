import os
from typing import Any, List, Coroutine, Literal, Optional, Union, overload
from openai import AsyncStream, AsyncAzureOpenAI
from openai.types.chat import (
    ChatCompletion,
    ChatCompletionChunk,
)
from azure.core.credentials import AzureKeyCredential
from azure.search.documents.aio import SearchClient
from azure.search.documents.models import (
    QueryType,
    VectorQuery,
)
from approaches.approach import Document, ThoughtStep
from approaches.chatapproach import ChatApproach
from core.modelhelper import get_token_limit


async def search(
    top: int,
    query_text: Optional[str],
    filter: Optional[str],
    vectors: List[VectorQuery],
    use_semantic_ranker: bool,
    use_semantic_captions: bool,
    ai_search_config: dict[str, str] = {},
) -> List[Document]:
    # Use semantic ranker if requested and if retrieval mode is text or hybrid (vectors + text)

    AZURE_SEARCH_SERVICE = os.environ["AZURE_SEARCH_SERVICE2"]
    AZURE_SEARCH_API_KEY = os.environ["AZURE_SEARCH_KEY2"]
    AZURE_SEARCH_ENDPOINT = f'https://{AZURE_SEARCH_SERVICE}.search.windows.net'

    search_client = SearchClient(
        endpoint=AZURE_SEARCH_ENDPOINT,
        index_name=ai_search_config['index_name'],
        credential=AzureKeyCredential(AZURE_SEARCH_API_KEY),
    )

    if use_semantic_ranker and query_text:
        results = await search_client.search(
            search_text=query_text,
            filter=filter,
            query_type=QueryType.SEMANTIC,
            query_language="en-us",
            query_speller="lexicon",
            # semantic_configuration_name="default",
            semantic_configuration_name="my-semantic-config2",
            top=top,
            query_caption="extractive|highlight-false" if use_semantic_captions else None,
            vector_queries=vectors,
        )
    else:
        results = await search_client.search(
            search_text=query_text or "", filter=filter, top=top, vector_queries=vectors
        )

    await search_client.close()
    documents = []
    async for page in results.by_page():
        async for document in page:
            # print(f"document: {document}")
            documents.append(
                Document(
                    id=document.get("id"),
                    content=document.get("content"),
                    category=document.get("category"),
                    sourcepage=document.get("title"),
                    sourcefile=document.get("source"),
                    search_score=document.get("@search.score"),
                    search_reranker_score=document.get(
                        "@search.reranker_score"),
                )
            )

    return documents


class ManufacturingApproach(ChatApproach):

    """
    A multi-step approach that first uses OpenAI to turn the user's question into a search query,
    then uses Azure AI Search to retrieve relevant documents, and then sends the conversation history,
    original user question, and search results to OpenAI to generate a response.
    """

    def __init__(
        self,
        *,
        # embedding_deployment: Optional[str],
        # embedding_model: str,
        sourcepage_field: str,
        content_field: str,
        query_language: str,
        query_speller: str,
    ):
        # self.embedding_deployment = embedding_deployment
        # self.embedding_model = embedding_model
        self.sourcepage_field = sourcepage_field
        self.content_field = content_field
        self.query_language = query_language
        self.query_speller = query_speller

    @property
    def system_message_chat_conversation(self):
        return """Assistant helps the company employees with their questions.
        {follow_up_questions_prompt}
        {injected_prompt}
        """

    @overload
    async def run_until_final_call(
        self,
        history: list[dict[str, str]],
        overrides: dict[str, Any],
        auth_claims: dict[str, Any],
        should_stream: Literal[False],
        functions: list[dict[str, Any]] = []
    ) -> tuple[dict[str, Any], Coroutine[Any, Any, ChatCompletion]]:
        ...

    @overload
    async def run_until_final_call(
        self,
        history: list[dict[str, str]],
        overrides: dict[str, Any],
        auth_claims: dict[str, Any],
        should_stream: Literal[True],
        functions: list[dict[str, Any]] = []
    ) -> tuple[dict[str, Any], Coroutine[Any, Any, AsyncStream[ChatCompletionChunk]]]:
        ...

    async def run_until_final_call(
        self,
        history: list[dict[str, str]],
        overrides: dict[str, Any],
        auth_claims: dict[str, Any],
        should_stream: bool = False,
        aoai_config: dict[str, str] = {},
        ai_search_config: dict[str, str] = {},
        embedding_config: dict[str, str] = {},
        functions: list[dict[str, Any]] = []
    ) -> tuple[dict[str, Any], Coroutine[Any, Any, Union[ChatCompletion, AsyncStream[ChatCompletionChunk]]]]:

        if aoai_config != {}:
            self.chatgpt_model = aoai_config['model']
            self.chatgpt_deployment = aoai_config['deployment']
            self.chatgpt_token_limit = get_token_limit(aoai_config['model'])
            self.openai_client = AsyncAzureOpenAI(
                api_version=aoai_config['api_version'],
                azure_endpoint=aoai_config['azure_endpoint'],
                api_key=aoai_config['api_key']
            )

        if embedding_config != {}:
            self.embedding_model = embedding_config['model']
            self.embedding_deployment = embedding_config['deployment']
            self.openai_embedding_client = AsyncAzureOpenAI(
                api_version=embedding_config['api_version'],
                azure_endpoint=embedding_config['azure_endpoint'],
                api_key=embedding_config['api_key']
            )

        has_text = overrides.get("retrieval_mode") in ["text", "hybrid", None]
        has_vector = overrides.get("retrieval_mode") in [
            "vectors", "hybrid", None]
        use_semantic_captions = True if overrides.get(
            "semantic_captions") and has_text else False
        top = overrides.get("top", 3)
        filter = self.build_filter(overrides, auth_claims)
        use_semantic_ranker = True if overrides.get(
            "semantic_ranker") and has_text else False

        original_user_query = history[-1]["content"]
        user_query_request = "Generate search query for: " + original_user_query

        functions = [
            {
                "name": "search_sources",
                "description": "Retrieve sources from the Azure AI Search index",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "search_query": {
                            "type": "string",
                            "description": "Query string to retrieve documents from azure search",
                        }
                    },
                    "required": ["search_query"],
                },
            }
        ]

        # STEP 1: Generate an optimized keyword search query based on the chat history and the last question
        messages = self.get_messages_from_history(
            system_prompt=self.query_prompt_template,
            model_id=self.chatgpt_model,
            history=history,
            user_content=user_query_request,
            max_tokens=self.chatgpt_token_limit - len(user_query_request),
            few_shots=self.query_prompt_few_shots,
        )

        chat_completion: ChatCompletion = await self.openai_client.chat.completions.create(
            messages=messages,  # type: ignore
            model=self.chatgpt_deployment if self.chatgpt_deployment else self.chatgpt_model,
            temperature=0.0,
            max_tokens=200,
            n=1,
            functions=functions,
            function_call="auto",
        )

        query_text = self.get_search_query(
            chat_completion, original_user_query)

        # STEP 2: Retrieve relevant documents from the search index with the GPT optimized query

        # If retrieval mode includes vectors, compute an embedding for the query
        vectors: list[VectorQuery] = []
        if has_vector:
            vectors.append(await self.compute_text_embedding(query_text))

        # Only keep the text query if the retrieval mode uses text, otherwise drop it
        if not has_text:
            query_text = None

        results = await search(top,
                               query_text,
                               filter,
                               vectors,
                               use_semantic_ranker,
                               use_semantic_captions,
                               ai_search_config)

        sources_content = self.get_sources_content(
            results, use_semantic_captions, use_image_citation=False)
        content = "\n".join(sources_content)

        # STEP 3: Generate a contextual and content specific answer using the search results and chat history

        # Allow client to replace the entire prompt, or to inject into the exiting prompt using >>>
        system_message = self.get_system_prompt(
            overrides.get("prompt_template"),
            self.follow_up_questions_prompt_content if overrides.get(
                "suggest_followup_questions") else "",
        )

        response_token_limit = overrides.get("max_tokens") or 1000
        messages_token_limit = self.chatgpt_token_limit - response_token_limit
        messages = self.get_messages_from_history(
            system_prompt=system_message,
            model_id=self.chatgpt_model,
            history=history,
            # Model does not handle lengthy system messages well. Moving sources to latest user conversation to solve follow up questions prompt.
            user_content=original_user_query + "\n\nSources:\n" + content,
            max_tokens=messages_token_limit,
        )

        data_points = {"text": sources_content}

        extra_info = {
            "data_points": data_points,
            "thoughts": [
                ThoughtStep(
                    "Original user query",
                    original_user_query,
                ),
                ThoughtStep(
                    "Generated search query",
                    query_text,
                    {"use_semantic_captions": use_semantic_captions,
                     "retrieval_mode": overrides.get("retrieval_mode"),
                     "has_vector": has_vector,
                     "use_semantic_ranker": use_semantic_ranker},
                ),
                ThoughtStep(
                    "Results", [result.serialize_for_results() for result in results]),
                ThoughtStep("Prompt", [str(message) for message in messages]),
            ],
        }

        chat_coroutine = self.openai_client.chat.completions.create(
            model=self.chatgpt_deployment if self.chatgpt_deployment else self.chatgpt_model,
            messages=messages,
            temperature=overrides.get("temperature") or 0.7,
            max_tokens=response_token_limit,
            n=1,
            stream=should_stream,
        )
        return (extra_info, chat_coroutine)
