import os
from dataclasses import dataclass
from typing import Any, AsyncGenerator, List, Optional, Union, cast

# import aiohttp
from azure.core.credentials import AzureKeyCredential
from azure.search.documents.aio import SearchClient
from azure.search.documents.models import (
    QueryType,
    VectorQuery,
    RawVectorQuery,
)

from core.authentication import AuthenticationHelper
from text import nonewlines


@dataclass
class Document:
    id: Optional[str]
    content: Optional[str]
    category: Optional[str]
    sourcepage: Optional[str]
    sourcefile: Optional[str]
    search_score: Optional[str]
    search_reranker_score: Optional[str]

    def serialize_for_results(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "content": self.content,
            "category": self.category,
            "sourcepage": self.sourcepage,
            "sourcefile": self.sourcefile,
            "search_score": self.search_score,
            "search_reranker_score": self.search_reranker_score,
        }

    @classmethod
    def trim_embedding(cls, embedding: Optional[List[float]]) -> Optional[str]:
        """Returns a trimmed list of floats from the vector embedding."""
        if embedding:
            if len(embedding) > 2:
                # Format the embedding list to show the first 2 items followed by the count of the remaining items."""
                return f"[{embedding[0]}, {embedding[1]} ...+{len(embedding) - 2} more]"
            else:
                return str(embedding)

        return None


@dataclass
class ThoughtStep:
    title: str
    description: Optional[Any]
    props: Optional[dict[str, Any]] = None


class Approach:
    def __init__(
        self,
        auth_helper: AuthenticationHelper,
        query_language: Optional[str],
        query_speller: Optional[str],
        # Not needed for non-Azure OpenAI or for retrieval_mode="text"
        embedding_deployment: Optional[str],
        embedding_model: str,
    ):
        self.auth_helper = auth_helper
        self.query_language = query_language
        self.query_speller = query_speller
        self.embedding_deployment = embedding_deployment
        self.embedding_model = embedding_model

    def build_filter(self, overrides: dict[str, Any], auth_claims: dict[str, Any]) -> Optional[str]:
        exclude_category = overrides.get("exclude_category") or None
        # security_filter = self.auth_helper.build_security_filters(
        #     overrides, auth_claims)
        filters = []
        if exclude_category:
            filters.append("category ne '{}'".format(
                exclude_category.replace("'", "''")))
        # if security_filter:
        #     filters.append(security_filter)
        return None if len(filters) == 0 else " and ".join(filters)

    async def search(
        self,
        top: int,
        query_text: Optional[str],
        filter: Optional[str],
        vectors: List[VectorQuery],
        use_semantic_ranker: bool,
        use_semantic_captions: bool,
        ai_search_config: dict[str, str] = {},
    ) -> List[Document]:
        # Use semantic ranker if requested and if retrieval mode is text or hybrid (vectors + text)

        AZURE_SEARCH_SERVICE = os.environ["AZURE_SEARCH_SERVICE"]
        AZURE_SEARCH_API_KEY = os.environ["AZURE_SEARCH_KEY"]
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
                query_language=self.query_language,
                query_speller=self.query_speller,
                # semantic_configuration_name="default",
                semantic_configuration_name="my-semantic-config",
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

    def get_sources_content(
        self, results: List[Document], use_semantic_captions: bool, use_image_citation: bool
    ) -> list[str]:
        if use_semantic_captions:
            return [
                (self.get_citation((doc.sourcepage or ""), use_image_citation))
                + ": "
                + nonewlines(" . ".join([cast(str, c.text)
                             for c in (doc.captions or [])]))
                for doc in results
            ]
        else:
            return [
                (self.get_citation((doc.sourcepage or ""), use_image_citation)
                 ) + ": " + nonewlines(doc.content or "")
                for doc in results
            ]

    def get_citation(self, sourcepage: str, use_image_citation: bool) -> str:
        if use_image_citation:
            return sourcepage
        else:
            path, ext = os.path.splitext(sourcepage)
            if ext.lower() == ".png":
                page_idx = path.rfind("-")
                page_number = int(path[page_idx + 1:])
                return f"{path[:page_idx]}.pdf#page={page_number}"

            return sourcepage

    async def compute_text_embedding(self, q: str):
        embedding = await self.openai_embedding_client.embeddings.create(
            # Azure Open AI takes the deployment name as the model name
            model=self.embedding_deployment if self.embedding_deployment else self.embedding_model,
            input=q,
        )
        query_vector = embedding.data[0].embedding
        await self.openai_embedding_client.close()
        return RawVectorQuery(vector=query_vector, k=50, fields="contentVector")

    # async def compute_image_embedding(self, q: str, vision_endpoint: str, vision_key: str):
    #     endpoint = f"{vision_endpoint}computervision/retrieval:vectorizeText"
    #     params = {"api-version": "2023-02-01-preview",
    #               "modelVersion": "latest"}
    #     headers = {"Content-Type": "application/json",
    #                "Ocp-Apim-Subscription-Key": vision_key}
    #     data = {"text": q}

    #     async with aiohttp.ClientSession() as session:
    #         async with session.post(
    #             url=endpoint, params=params, headers=headers, json=data, raise_for_status=True
    #         ) as response:
    #             json = await response.json()
    #             image_query_vector = json["vector"]
    #     return RawVectorQuery(vector=image_query_vector, k=50, fields="imageEmbedding")

    async def run(
        self, messages: list[dict], stream: bool = False, session_state: Any = None, context: dict[str, Any] = {}
    ) -> Union[dict[str, Any], AsyncGenerator[dict[str, Any], None]]:
        raise NotImplementedError
