# Refactored from https://github.com/Azure-Samples/ms-identity-python-on-behalf-of

from typing import Optional

import requests
from flask import jsonify
from msal.token_cache import TokenCache
from msal import ConfidentialClientApplication
from .token_verifier import get_verified_payload


# AuthError is raised when the authentication token sent by the client UI cannot be parsed or there is an authentication error accessing the graph API
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

    def __str__(self) -> str:
        return self.error or ""


class AuthenticationHelper:

    def __init__(
        self,
        use_authentication: bool,
        server_app_id: Optional[str],
        client_app_secret: Optional[str],
        client_app_id: Optional[str],
        tenant_id: Optional[str],
        require_access_control: bool = False,
    ):
        self.use_authentication = use_authentication
        self.server_app_id = server_app_id
        self.client_app_secret = client_app_secret
        self.client_app_id = client_app_id
        self.tenant_id = tenant_id
        self.require_access_control = require_access_control
        self.authority = f"https://login.microsoftonline.com/{tenant_id}"

        if self.use_authentication:
            self.require_access_control = require_access_control
            self.confidential_client = ConfidentialClientApplication(
                client_app_id, authority=self.authority, client_credential=client_app_secret, token_cache=TokenCache()
            )
        else:
            self.has_auth_fields = False
            self.require_access_control = False

    def validate_access_token_payload(self, access_token: str) -> bool:
        try:
            payload = get_verified_payload(
                access_token, self.tenant_id, audience_uris=[self.server_app_id])
            if payload.get("aud") == self.server_app_id and payload.get("tid") == self.tenant_id:
                return True
            else:
                return False
        except Exception:
            return False

    def get_token(self, client_id, client_secret, scope):
        payload = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
            "scope": scope}

        response = requests.post(
            self.authority + "/oauth2/v2.0/token", data=payload)

        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            return jsonify({"error": "Authorization failed."}), 401

    def get_auth_setup_for_client(self):
        return {
            "use_authentication": self.use_authentication,
            "server_app_id": self.server_app_id,
            "client_app_secret": self.mask_secret(self.client_app_secret),
            "client_app_id": self.client_app_id,
            "tenant_id": self.tenant_id,
            "require_access_control": self.require_access_control,
        }

    @staticmethod
    def mask_secret(secret: Optional[str]) -> Optional[str]:
        if secret is None:
            return None
        return '*' * len(secret)

    def get_auth_claims_if_enabled(self, requestHeaders: dict[str, str]):
        if "Authorization" in requestHeaders:
            access_token = requestHeaders["Authorization"]
            return get_verified_payload(access_token, self.tenant_id, audience_uris=[self.client_app_id])
        else:
            return None
