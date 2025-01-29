# step 8)  the Static Web Application Id
output "application_id" {
  value = azuread_application_registration.front_end_client_app_registration.client_id
}

output "application_secret" {
  value = azuread_service_principal_password.front_end_client_app_registration_pass.value
  sensitive =true
}

output "storage_account_name" {
  value = azurerm_storage_account.storage1.name
}

output "storage_connection_string" {
  value = azurerm_storage_account.storage1.primary_connection_string
  sensitive = true
}


output "cosmosdb_app_container_connection_info" {
  value = {
    endpoint = azurerm_cosmosdb_account.db.endpoint
    key      = azurerm_cosmosdb_account.db.primary_key
    database_name = azurerm_cosmosdb_sql_database.gbbai_database.name
    container_name = azurerm_cosmosdb_sql_container.apps_container.name
  }
  sensitive = true
}

output "ai_search_service_name" {
  value = azurerm_search_service.ai_search_service.name
}

output "document_intelligence_endpoint" {
  value = azurerm_cognitive_account.document_intelligence.endpoint
}


output "function_data_process_function_app_url" {
  value= azurerm_linux_function_app.function_call_data_process_function_app.default_hostname
}

output "function_call_function_app_url" {
  value= azurerm_linux_function_app.function_call_function_app.default_hostname
}

output "function_chat_da_function_app_url" {
  value= azurerm_linux_function_app.chat_da_function_app.default_hostname
}

output "backend_web_app_url"{
   value = azurerm_linux_web_app.backend_webapp.default_hostname
}

output "frontend_static_web_app_url" {
  value = azurerm_static_web_app.frontend_webapp.default_host_name
}

output "function_call_ingress_url" {
  value = azurerm_container_app.function_call.ingress[0].fqdn
}

output "azurerm_container_app_application_url"{
    value = azurerm_container_app.function_call.latest_revision_fqdn
}
