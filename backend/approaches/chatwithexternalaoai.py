from typing import Any, Coroutine, Literal, Optional, Union, overload

from openai import AsyncStream, AsyncAzureOpenAI
from openai.types.chat import (
    ChatCompletion,
    ChatCompletionChunk,
)

from approaches.approach import ThoughtStep
from approaches.chatapproach import ChatApproach

from core.authentication import AuthenticationHelper
from core.modelhelper import get_token_limit


class ChatWithExternalAoai(ChatApproach):

    def __init__(
        self,
        *,
        auth_helper: AuthenticationHelper,
        sourcepage_field: str,
        content_field: str,
        query_language: str,
        query_speller: str,
    ):
        self.auth_helper = auth_helper
        self.sourcepage_field = sourcepage_field
        self.content_field = content_field
        self.query_language = query_language
        self.query_speller = query_speller

    @property
    def system_message_chat_conversation(self):
        return """You are an assistant designed to help people answer questions."""

    @overload
    async def run_until_final_call(
        self,
        history: list[dict[str, str]],
        overrides: dict[str, Any],
        auth_claims: dict[str, Any],
        should_stream: Literal[False],
        aoai_config: dict[str, str] = {},
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
        aoai_config: dict[str, str] = {},
        functions: list[dict[str, Any]] = []
    ) -> tuple[dict[str, Any], Coroutine[Any, Any, AsyncStream[ChatCompletionChunk]]]:
        ...

    async def run_until_final_call(
        self,
        history: list[dict[str, str]],
        overrides: dict[str, Any],
        auth_claims: dict[str, Any],
        should_stream: bool = True,
        aoai_config: dict[str, str] = {},
        ai_search_config: dict[str, str] = {},
        embedding_config: dict[str, str] = {},
        functions: list[dict[str, Any]] = []
    ) -> tuple[dict[str, Any], Coroutine[Any, Any, Union[ChatCompletion, AsyncStream[ChatCompletionChunk]]]]:

        if aoai_config != {}:
            self.chatgpt_model = aoai_config['model']
            self.chatgpt_token_limit = get_token_limit(aoai_config['model'])
            self.chatgpt_deployment = aoai_config['deployment']
            self.openai_client = AsyncAzureOpenAI(
                api_version=aoai_config['api_version'],
                azure_endpoint=aoai_config['azure_endpoint'],
                api_key=aoai_config['api_key']
            )

        # Allow client to replace the entire prompt, or to inject into the exiting prompt using >>>
        # print(overrides.get("prompt_template"))
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
            user_content='',
            max_tokens=messages_token_limit,
        )

        data_points = {}

        extra_info = {
            "data_points": data_points,
            "thoughts": [
                ThoughtStep(
                    "Original user query",
                    '',
                ),
            ],
        }

        print("should_stream: ", should_stream)
        if len(functions) > 0:
            chat_coroutine = self.openai_client.chat.completions.create(
                model=self.chatgpt_deployment if self.chatgpt_deployment else self.chatgpt_model,
                messages=messages,
                temperature=overrides.get("temperature") or 0.7,
                max_tokens=response_token_limit,
                n=1,
                stream=should_stream,
                functions=functions,
                function_call="auto",
            )
            return (extra_info, chat_coroutine)
        else:
            chat_coroutine = self.openai_client.chat.completions.create(
                model=self.chatgpt_deployment if self.chatgpt_deployment else self.chatgpt_model,
                messages=messages,
                temperature=overrides.get("temperature") or 0.7,
                max_tokens=response_token_limit,
                n=1,
                stream=should_stream,
            )
            return (extra_info, chat_coroutine)
