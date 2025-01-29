# step 6) 2 Create  Function Apps for data processing
resource "random_string" "function_data_process_name_random" {
  length  = 6
  lower   = true
  special = false
  upper   = false
}

resource "azurerm_resource_group" "resource_group_AI_platform_func_data" {
  location = var.location
  name     = "${azurerm_resource_group.resource_group_AI_platform.name}-funcData"
}

# role & scope 
resource "azurerm_role_assignment" "azuread_application_privileges_func_data_assignment" {
  scope                = azurerm_resource_group.resource_group_AI_platform_func_data.id
  role_definition_name = "Owner"
  principal_id         = azuread_service_principal.front_end_client_app_registration_principal.object_id
}


resource "azurerm_storage_account" "function_data_process_storage_account" {
  name                = "${module.ai_resource_naming.storage_account.name_unique}dataproc"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_func_data.name
  location            = var.app_location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "function_call_data_process_service_plan" {
  name                = "${module.ai_resource_naming.app_service_plan.name_unique}dataproc"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_func_data.name
  location            = var.app_location
  os_type             = "Linux"
  sku_name            = "EP1"
}

data "archive_file" "function_for_data_processing_package" {  
  type = "zip"  
  source_dir = "../azure-function/function_for_data_processing"
  output_path = "./function_for_data_processing.zip"
}


resource "azurerm_linux_function_app" "function_call_data_process_function_app" {
  name                 = "${module.ai_resource_naming.function_app.name_unique}dataproc"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_func_data.name
  location            = var.app_location
  service_plan_id      = azurerm_service_plan.function_call_data_process_service_plan.id
  storage_account_name = azurerm_storage_account.function_data_process_storage_account.name
  storage_account_access_key = azurerm_storage_account.function_data_process_storage_account.primary_access_key
  

  site_config {
    cors {
      allowed_origins = ["*"]
    }
    application_stack {
        python_version = "3.11"
    }
  }

  webdeploy_publish_basic_authentication_enabled = true
  ftp_publish_basic_authentication_enabled = true

  app_settings = {
    AZURE_COSMOS_DATABASE         = var.azurerm_cosmosdb_sql_database_name
    AZURE_COSMOS_ENDPOINT         = azurerm_cosmosdb_account.db.endpoint
    AZURE_COSMOS_KEY = azurerm_cosmosdb_account.db.primary_key
    AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT = azurerm_cognitive_account.document_intelligence.endpoint
    AZURE_DOCUMENT_INTELLIGENCE_KEY = azurerm_cognitive_account.document_intelligence.primary_access_key
    AZURE_OPENAI_API_KEY = var.azure_openai_api_key
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT = var.azure_openai_emb_deployment
    AZURE_OPENAI_ENDPOINT = var.azure_openai_endpoint
    AZURE_SEARCH_ADMIN_KEY = azurerm_search_service.ai_search_service.primary_key
    AZURE_SEARCH_ENDPOINT = "https://${azurerm_search_service.ai_search_service.name}.search.windows.net"
    AzureWebJobsStorage = azurerm_storage_account.storage1.primary_connection_string
  }
}

# Define local-exec provisioner to run az cli commands
resource "null_resource" "publish_data_process_function_zip" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
    command = "az functionapp deployment source config-zip --subscription ${var.subscription_id} --resource-group ${azurerm_linux_function_app.function_call_data_process_function_app.resource_group_name} --name ${azurerm_linux_function_app.function_call_data_process_function_app.name} --src ${data.archive_file.function_for_data_processing_package.output_path} --build-remote true --timeout 120"
  }
  depends_on = [ azurerm_linux_function_app.function_call_data_process_function_app]
}
