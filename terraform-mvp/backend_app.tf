# step 7) Create  Web App for backend service

# create backend app registration
resource "azuread_application_registration" "backend_app_registration" {
  display_name="${module.ai_resource_naming.app_configuration.name_unique}_backend_app"
  sign_in_audience = "AzureADMyOrg"
}

resource "azuread_service_principal" "backend_app_registration_principal" {
  client_id = azuread_application_registration.backend_app_registration.client_id
  owners=[data.azurerm_client_config.current.object_id]
}

resource "azuread_application_identifier_uri" "backend_app_registration_identifier_uri" {
  application_id = azuread_application_registration.backend_app_registration.id
  identifier_uri = "api://${azuread_application_registration.backend_app_registration.client_id}"
}

# resource group
resource "azurerm_resource_group" "resource_group_AI_platform_backend_app" {
  location = var.location
  name     = "${azurerm_resource_group.resource_group_AI_platform.name}-backendApp"
}


# role & scope 
resource "azurerm_role_assignment" "azuread_application_privileges_backend_app_assignment" {
  scope                = azurerm_resource_group.resource_group_AI_platform_backend_app.id
  role_definition_name = "Owner"
  principal_id         = azuread_service_principal.front_end_client_app_registration_principal.object_id
}

# Create the Linux App Service Plan
resource "azurerm_service_plan" "backend_appserviceplan" {
  name                = "${module.ai_resource_naming.app_service_plan.name_unique}backend"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_backend_app.name
  location            = var.app_location
  os_type             = "Linux"
  sku_name            = "B3"
}


data "archive_file" "python_backend_webapp_package" {  
  type = "zip"  
  source_dir = "../backend" 
  output_path = "./backend.zip"
}

# Create the web app, pass in the App Service Plan ID
resource "azurerm_linux_web_app" "backend_webapp" {
  name                  = "${module.ai_resource_naming.app_service.name_unique}backend"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform_backend_app.name
  location            = var.app_location
  service_plan_id       = azurerm_service_plan.backend_appserviceplan.id
  https_only            = true
  webdeploy_publish_basic_authentication_enabled = true
  ftp_publish_basic_authentication_enabled = true  

  site_config { 
    minimum_tls_version = "1.2"
    cors {
      allowed_origins = ["*"]
    }
    application_stack {
        python_version = "3.11"
    }
    ftps_state = "AllAllowed"
  }

  # auth_settings {
  #   enabled = false
  #   default_provider ="AzureActiveDirectory"
  #   issuer="https://sts.windows.net/${var.tenant_id}/"
  # }

  auth_settings_v2 {
    auth_enabled           = true
    unauthenticated_action = "AllowAnonymous"
    require_authentication = false
    require_https          = false

    active_directory_v2 {
      client_id = azuread_application_registration.backend_app_registration.client_id
      client_secret_setting_name = "MICROSOFT_PROVIDER_AUTHENTICATION_SECRET" # This should be allowed optional
      tenant_auth_endpoint       = "https://sts.windows.net/${var.tenant_id}"
      allowed_audiences          = ["api://${azuread_application_registration.front_end_client_app_registration.client_id}"]
      allowed_applications       = ["${azuread_application_registration.front_end_client_app_registration.client_id}"]
    }

    login {
      token_store_enabled = true
    }
  }
  
  app_settings = {
    AZURE_COSMOS_ENDPOINT         = azurerm_cosmosdb_account.db.endpoint
    AZURE_COSMOS_KEY = azurerm_cosmosdb_account.db.primary_key
    AZURE_COSMOS_DB_PREFIX="GbbAi"

    AzureWebJobsStorage = azurerm_storage_account.storage1.primary_connection_string

    AZURE_STORAGE_CONNECTION_STRING=azurerm_storage_account.storage1.primary_connection_string
    AZURE_STORAGE_QUEUE_NAME=azurerm_storage_queue.ragdataprocessing.name
    AZURE_STORAGE_ACCOUNT=azurerm_storage_account.storage1.name 
    AZURE_STORAGE_CONTAINER =azurerm_storage_container.posts.name

    AZURE_SEARCH_ENDPOINT = azurerm_search_service.ai_search_service.name
    AZURE_SEARCH_SERVICE=azurerm_search_service.ai_search_service.name
    AZURE_SEARCH_KEY=azurerm_search_service.ai_search_service.primary_key
    AZURE_OPENAI_EMB_MODEL_NAME=var.AZURE_OPENAI_EMB_MODEL
    app_command_line = "python3 -m gunicorn main:app"
    WEBSITE_WEBDEPLOY_USE_SCM=true
    SCM_DO_BUILD_DURING_DEPLOYMENT=true

    AZURE_SERVER_APP_ID = azuread_application_registration.backend_app_registration.client_id
    AZURE_CLIENT_APP_ID = azuread_application_registration.front_end_client_app_registration.client_id
    AZURE_CLIENT_APP_SECRET = azuread_service_principal_password.front_end_client_app_registration_pass.value
    WEBSITE_AUTH_AAD_ALLOWED_TENANTS="${var.tenant_id}"
    AZURE_TENANT_ID=var.tenant_id
    AZURE_USE_AUTHENTICATION =var.use_authetication
    AZURE_ENFORCE_ACCESS_CONTROL=var.enforce_access_control

 }
}

resource "null_resource" "publish_backend_app_startup" {
  triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
    command = "az webapp config set --subscription ${var.subscription_id} --resource-group ${azurerm_linux_web_app.backend_webapp.resource_group_name} --name ${azurerm_linux_web_app.backend_webapp.name} --startup-file 'python3 -m gunicorn main:app' "
  }
  depends_on = [azurerm_linux_web_app.backend_webapp]
}

# Define local-exec provisioner to run az cli commands
resource "null_resource" "publish_backend_app_zip" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
    command = "timeout 600 az webapp deploy --subscription ${var.subscription_id} --resource-group ${azurerm_linux_web_app.backend_webapp.resource_group_name} --name ${azurerm_linux_web_app.backend_webapp.name} --src-path ${data.archive_file.python_backend_webapp_package.output_path} --type zip"
  }
  depends_on = [null_resource.publish_backend_app_startup,data.archive_file.python_backend_webapp_package]
}
