# step 6) Create a Function Apps for function call

resource "azurerm_resource_group" "resource_group_AI_platform_func_Call" {
  location = var.location
  name     = "${azurerm_resource_group.resource_group_AI_platform.name}-funcCall"
}

# role & scope 
resource "azurerm_role_assignment" "azuread_application_privileges_func_call_assignment" {
  scope                = azurerm_resource_group.resource_group_AI_platform_func_Call.id
  role_definition_name = "Owner"
  principal_id         = azuread_service_principal.front_end_client_app_registration_principal.object_id
}

resource "azurerm_storage_account" "function_call_storage_account" {
  name                = "${module.ai_resource_naming.storage_account.name_unique}funcall"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_func_Call.name
  location            = var.app_location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_service_plan" "function_call_service_plan" {
  name                = "${module.ai_resource_naming.app_service_plan.name_unique}funcall"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_func_Call.name
  location            = var.app_location
  os_type             = "Linux"
  sku_name            = "Y1"
}

data "archive_file" "function_for_gpt_package" {  
  type = "zip"  
  source_dir = "../azure-function/function_for_gpt"
  output_path = "./function_for_gpt.zip"
}

resource "azurerm_linux_function_app" "function_call_function_app" {
  name                 = "${module.ai_resource_naming.function_app.name_unique}funcall"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_func_Call.name
  location            = var.app_location
  service_plan_id      = azurerm_service_plan.function_call_service_plan.id
  storage_account_name = azurerm_storage_account.function_call_storage_account.name
  storage_account_access_key = azurerm_storage_account.function_call_storage_account.primary_access_key

  site_config {
    cors {
      allowed_origins = ["*"]
    }
    application_stack {
        python_version = "3.11"
    }
  }

  app_settings = {
    AZURE_DALLE_ENDPOINT         = var.azure_dalle_endpoint
    AZURE_DALLE_KEY              = var.azure_dalle_key
    AZURE_DALLE_DEPLOYMENT       = var.azure_dalle_deployment
    BING_SEARCH_SUBSCRIPTION_KEY = var.bing_search_subscription_key
  }
}

# Define local-exec provisioner to run az cli commands
resource "null_resource" "publish_function_call_zip" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
    command = "az functionapp deployment source config-zip --subscription ${var.subscription_id}  --resource-group ${azurerm_linux_function_app.function_call_function_app.resource_group_name} --name ${azurerm_linux_function_app.function_call_function_app.name} --src ${data.archive_file.function_for_gpt_package.output_path} --build-remote true --timeout 120"
  }
  depends_on = [ azurerm_linux_function_app.function_call_function_app]
}

# Insert sample tools to the app container
resource "null_resource" "copy_tool_cosomos_python_code" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
     command = "rm -rf './toolCreationForCosmosDB.py' && cp ./toolCreationForCosmosDB.py.bak ./toolCreationForCosmosDB.py"
  }
  depends_on = [ azurerm_linux_function_app.function_call_function_app, azurerm_storage_container.tools ]
}

resource "null_resource" "replace_function_call_url" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
    command = "./replacement.sh './toolCreationForCosmosDB.py' '{\"<FUNCTION_CALL_URL_PLACEHOLDER>\": \"${azurerm_linux_function_app.function_call_function_app.default_hostname}\"}'"
  }

  depends_on = [ azurerm_linux_function_app.function_call_function_app, null_resource.copy_tool_cosomos_python_code]
}

resource "null_resource" "run_tool_python_script" {
  triggers = {
    azurerm_cosmosdb_sql_container_id = azurerm_cosmosdb_sql_container.tools_container.id
  }

  provisioner "local-exec" {
    command = "pip3 install azure.cosmos &&  python3 ./toolCreationForCosmosDB.py '${azurerm_cosmosdb_account.db.endpoint}' '${azurerm_cosmosdb_account.db.primary_key}' '${azurerm_cosmosdb_sql_database.gbbai_database.name}' '${azurerm_cosmosdb_sql_container.tools_container.name}' "
  }

  depends_on = [ null_resource.replace_function_call_url]
}


# step 7) Create a Container App for function call
resource "azurerm_storage_share" "container_apps_storage_share" {
  name                 = "${module.ai_resource_naming.storage_account.name_unique}share"
  storage_account_name = azurerm_storage_account.function_call_storage_account.name
  quota                = 100
}

resource "azurerm_log_analytics_workspace" "function_call" {
  name                = "${module.ai_resource_naming.log_analytics_workspace.name_unique}funcall"
  location            = var.app_location
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_func_Call.name
}

resource "azurerm_container_app_environment" "function_call" {
  name                       = "${module.ai_resource_naming.container_app_environment.name_unique}-fun-call"
  location                   = var.app_location
  resource_group_name        = azurerm_resource_group.resource_group_AI_platform_func_Call.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.function_call.id
}

resource "azurerm_container_app_environment_storage" "container_apps_storage" {
  name                         = "${module.ai_resource_naming.storage_account.name_unique}appshare"
  container_app_environment_id = azurerm_container_app_environment.function_call.id
  account_name                 = azurerm_storage_account.function_call_storage_account.name
  share_name                   = azurerm_storage_share.container_apps_storage_share.name
  access_key                   = azurerm_storage_account.function_call_storage_account.primary_access_key
  access_mode                  = "ReadWrite"
}

resource "azurerm_container_app" "function_call" {
  name                         = "${module.ai_resource_naming.container_app.name_unique}-fun-call"
  container_app_environment_id = azurerm_container_app_environment.function_call.id
  resource_group_name          = azurerm_resource_group.resource_group_AI_platform_func_Call.name
  revision_mode                = "Single"
  
  ingress {
      target_port               = 8080
      transport                 = "auto"
      external_enabled          = true

      traffic_weight {
        percentage = 100
        latest_revision=true
      }
  }

  template {
    container {
      name   = "function-call"
      image  = "huqianghui/function_call_poc:v2"
      cpu                  = "1.0"
      memory               = "2Gi"

      liveness_probe {
        port = 8080
        transport = "HTTP"
        path = "/"
        initial_delay=60
        interval_seconds=10
        timeout = 1
        failure_count_threshold =3
      }
      # volume_mounts {
      #   name = "appshare"
      #   path = "/app"
      # }
    }
    max_replicas = 1
    min_replicas = 1
    # http_scale_rule {
    #   name = "http-scaling"
    #   concurrent_requests=10
    # }
    # volume {
    #   name = "appshare"
    #   storage_name= azurerm_container_app_environment_storage.container_apps_storage.name
    #   storage_type = "AzureFile"
    # }
  }
}

resource "azapi_update_resource" "container_app_update_cros_policy" {
  type        = "Microsoft.App/containerApps@2023-05-01"
  resource_id = azurerm_container_app.function_call.id

  body = jsonencode({
    properties = {
      configuration = {
        ingress = {
          corsPolicy = {
            allowedOrigins = ["*"]
            allowedMethods = ["*"]
            allowedHeaders = ["*"]
          }
        }
      }
    }
  })
}
