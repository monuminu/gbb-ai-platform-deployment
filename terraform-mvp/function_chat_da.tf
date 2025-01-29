# Create a Function Apps for chat DA

resource "azurerm_resource_group" "resource_group_AI_platform_chat_da" {
  location = var.location
  name     = "${azurerm_resource_group.resource_group_AI_platform.name}-funcChatDa"
}

# role & scope 
resource "azurerm_role_assignment" "azuread_application_privileges_chat_da_assignment" {
  scope                = azurerm_resource_group.resource_group_AI_platform_chat_da.id
  role_definition_name = "Owner"
  principal_id         = azuread_service_principal.front_end_client_app_registration_principal.object_id
}

resource "azurerm_storage_account" "chat_da_storage_account" {
  name                = "${module.ai_resource_naming.storage_account.name_unique}chatda"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_chat_da.name
  location            = var.app_location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "chat_da_service_plan" {
  name                = "${module.ai_resource_naming.app_service_plan.name_unique}chatda"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_chat_da.name
  location            = var.app_location
  os_type             = "Linux"
  sku_name            = "Y1"
}

data "archive_file" "function_for_chat_da_package" {  
  type = "zip"  
  source_dir = "../azure-function/function_for_chat_da"
  output_path = "./function_for_chat_da.zip"
}

resource "azurerm_linux_function_app" "chat_da_function_app" {
  name                 = "${module.ai_resource_naming.function_app.name_unique}chatda"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_chat_da.name
  location            = var.app_location
  service_plan_id      = azurerm_service_plan.chat_da_service_plan.id
  storage_account_name = azurerm_storage_account.chat_da_storage_account.name
  storage_account_access_key = azurerm_storage_account.chat_da_storage_account.primary_access_key

  site_config {
    cors {
      allowed_origins = ["*"]
    }
    application_stack {
        python_version = "3.11"
    }
  }
}

# insert sample apps to the app container
resource "null_resource" "copy_cosomos_python_code" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
     command = "rm -rf './itemCreationForCosmosDB.py' && cp ./itemCreationForCosmosDB.py.bak ./itemCreationForCosmosDB.py"
  }
  depends_on = [ azurerm_linux_function_app.chat_da_function_app, azurerm_storage_container.apps ]
}

resource "null_resource" "replace_chat_da_url" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
    command = "./replacement.sh './itemCreationForCosmosDB.py' '{\"<CHAT_DA_URL_PLACEHOLDER>\": \"${azurerm_linux_function_app.chat_da_function_app.default_hostname}\"}'"
  }
  depends_on = [ azurerm_linux_function_app.chat_da_function_app,null_resource.copy_cosomos_python_code]
}

resource "null_resource" "run_python_script" {
  triggers = {
    azurerm_cosmosdb_sql_container_id = azurerm_cosmosdb_sql_container.apps_container.id
  }

  provisioner "local-exec" {
    command = "pip3 install azure.cosmos &&  python3 ./itemCreationForCosmosDB.py '${azurerm_cosmosdb_account.db.endpoint}' '${azurerm_cosmosdb_account.db.primary_key}' '${azurerm_cosmosdb_sql_database.gbbai_database.name}' '${azurerm_cosmosdb_sql_container.apps_container.name}' "
  }

  depends_on = [ null_resource.replace_chat_da_url]
}


# Define local-exec provisioner to run az cli commands
resource "null_resource" "publish_chat_da_zip" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
    command = "timeout 600 az functionapp deployment source config-zip --subscription ${var.subscription_id}  --resource-group ${azurerm_linux_function_app.chat_da_function_app.resource_group_name} --name ${azurerm_linux_function_app.chat_da_function_app.name} --src ${data.archive_file.function_for_chat_da_package.output_path} --build-remote true --timeout 120"
  }
  depends_on = [ azurerm_linux_function_app.chat_da_function_app]
}
