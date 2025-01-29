module "resource_group_naming" {
  source  = "Azure/naming/azurerm"
  suffix = [var.resource_group_name]
}

# step) 0.create a resource group to host all resouces except web app & function app
resource "azurerm_resource_group" "resource_group_AI_platform" {
  location = var.location
  name     = module.resource_group_naming.resource_group.name_unique
}

# step) 1.Create an App Registration in Microsoft Entra ID.
module "ai_resource_naming" {
  source  = "Azure/naming/azurerm"
  suffix = ["gbbai"]
}

data "azurerm_client_config" "current" {}

resource "azuread_application_registration" "front_end_client_app_registration" {
  display_name=module.ai_resource_naming.app_configuration.name_unique
  sign_in_audience = "AzureADMyOrg"
}

resource "azuread_service_principal" "front_end_client_app_registration_principal" {
  client_id = azuread_application_registration.front_end_client_app_registration.client_id
  owners=[data.azurerm_client_config.current.object_id]
  
}

resource "azuread_service_principal_password" "front_end_client_app_registration_pass" {   
  service_principal_id = azuread_service_principal.front_end_client_app_registration_principal.object_id
  
  }  

resource "azuread_application_redirect_uris" "front_end_client_app_registration_spa" {
  application_id = azuread_application_registration.front_end_client_app_registration.id
  type           = "SPA"

  redirect_uris = [
    "http://localhost:8080/",
    "https://${azurerm_static_web_app.frontend_webapp.default_host_name}/"
  ]
}

# role & scope 
resource "azurerm_role_assignment" "azuread_application_privileges_assignment" {
  scope                = azurerm_resource_group.resource_group_AI_platform.id
  role_definition_name = "Owner"
  principal_id         = azuread_service_principal.front_end_client_app_registration_principal.object_id
}

# step 2) create a storage account 
# 创建存储帐户
resource "azurerm_storage_account" "storage1" {
  name                     =  module.ai_resource_naming.storage_account.name_unique
  resource_group_name      = azurerm_resource_group.resource_group_AI_platform.name
  location                 = azurerm_resource_group.resource_group_AI_platform.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# 创建存储容器
resource "azurerm_storage_container" "posts" {
  name                  = "posts"
  storage_account_name  = azurerm_storage_account.storage1.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "documentation" {
  name                  = "documentation"
  storage_account_name  = azurerm_storage_account.storage1.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "apps" {
  name                  = "apps"
  storage_account_name  = azurerm_storage_account.storage1.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "tools" {
  name                  = "tools"
  storage_account_name  = azurerm_storage_account.storage1.name
  container_access_type = "private"
}


# 创建存储队列
resource "azurerm_storage_queue" "ragdataprocessing" {
  name                 = "ragdataprocessing"
  storage_account_name = azurerm_storage_account.storage1.name
}

# step 3) Azure Cosmos DB for NoSQL
resource "azurerm_cosmosdb_account" "db" {
  name                = module.ai_resource_naming.cosmosdb_account.name_unique
  location            = var.cosmodb_location
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  capabilities {
    name = "EnableServerless"
  }

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }

  geo_location {
    location          = azurerm_resource_group.resource_group_AI_platform.location
    failover_priority = 0
  }
}
    
# 创建 Cosmos DB 数据库 GbbAi
resource "azurerm_cosmosdb_sql_database" "gbbai_database" {
  name                = "GbbAi"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  account_name        = azurerm_cosmosdb_account.db.name
}

variable azurerm_cosmosdb_sql_database_name {
  type = string
  default = "GbbAiKnowledgeBases"
} 

# 创建 Cosmos DB 数据库 GbbAiKnowledgeBases
resource "azurerm_cosmosdb_sql_database" "gbbai_knowledge_bases_database" {
  name                = var.azurerm_cosmosdb_sql_database_name
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  account_name        = azurerm_cosmosdb_account.db.name
}

# 创建容器 Apps
resource "azurerm_cosmosdb_sql_container" "apps_container" {
  name                = "Apps"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_sql_database.gbbai_database.name
  partition_key_path  = "/id"
}

# Create a container for Tools
resource "azurerm_cosmosdb_sql_container" "tools_container" {
  name                = "Tools"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_sql_database.gbbai_database.name
  partition_key_path  = "/id"
}

# 创建容器 DocumentationContents
resource "azurerm_cosmosdb_sql_container" "documentation_contents_container" {
  name                = "DocumentationContents"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_sql_database.gbbai_database.name
  partition_key_path  = "/id"
}

# 创建容器 DocumentationFaqs
resource "azurerm_cosmosdb_sql_container" "documentation_faqs_container" {
  name                = "DocumentationFaqs"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_sql_database.gbbai_database.name
  partition_key_path  = "/id"
}

# 创建容器 Catalog
resource "azurerm_cosmosdb_sql_container" "catalog_container" {
  name                = "Catalog"
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  account_name        = azurerm_cosmosdb_account.db.name
  database_name       = azurerm_cosmosdb_sql_database.gbbai_knowledge_bases_database.name
  partition_key_path  = "/id"
}

# step 4) Create an Azure AI Search
resource "azurerm_search_service" "ai_search_service" {
  name                = module.ai_resource_naming.search_service.name_unique
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  location            = azurerm_resource_group.resource_group_AI_platform.location
  sku                 = "standard"
  semantic_search_sku = "standard"
}

# step 5) Create a Document Intelligence
resource "azurerm_cognitive_account" "document_intelligence" {
  name                = module.ai_resource_naming.cognitive_account.name_unique
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  location            = azurerm_resource_group.resource_group_AI_platform.location
  kind                = "FormRecognizer"  # Specify Document Intelligence
  sku_name            = "S0"
}


# step 8) Create static Web App for frontend
resource "azurerm_static_web_app" "frontend_webapp" {
  name                = module.ai_resource_naming.static_web_app.name_unique
  resource_group_name = azurerm_resource_group.resource_group_AI_platform.name
  location            = var.static_web_location
}

resource "null_resource" "copy_fontend_source_code" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
    command = "rm -rf '${var.dist_folder_path}' && cp -r ${var.src_folder_path} ${var.dist_folder_path}"
  }

}

resource "null_resource" "replace_placeholder" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
     command = "./replacement.sh '${var.dist_folder_path}' '{\"<AD_CLIENT_ID_PLACEHOLDER>\": \"${azuread_application_registration.front_end_client_app_registration.client_id}\",\"<AD_REDIRECT_URI_PLACEHOLDER>\": \"https://${azurerm_static_web_app.frontend_webapp.default_host_name}/\",\"<BACKEND_API_PLACEHOLDER>\":\"https://${azurerm_linux_web_app.backend_webapp.default_hostname}/\",\"<FUNCTION_API_PLACEHOLDER>\":\"https://${azurerm_linux_function_app.function_call_function_app.default_hostname}/api/HttpExample/\",\"<TOOL_API_PLACEHOLDER>\":\"https://${azurerm_container_app.function_call.ingress[0].fqdn}\"}' "
  }

  depends_on = [ null_resource.copy_fontend_source_code]
}


# Define local-exec provisioner to run az cli commands
resource "null_resource" "publish_website" {
  #triggers = {always_run = "${timestamp()}"}
  provisioner "local-exec" {
    command = "swa deploy ./frontend/dist --env production  --tenant-id '${var.tenant_id}'  --subscription-id '${var.subscription_id}'  --resource-group '${azurerm_static_web_app.frontend_webapp.resource_group_name}'  --app-name '${azurerm_static_web_app.frontend_webapp.name}' --no-use-keychain  --client-id '${azuread_application_registration.front_end_client_app_registration.client_id}' --client-secret '${azuread_service_principal_password.front_end_client_app_registration_pass.value}'"
  }

  depends_on = [ null_resource.replace_placeholder ]
}
