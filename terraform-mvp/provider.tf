provider "azurerm" {
  features {
  }
  #  if you do not to use the default subscriptions and tenants, you can specify them here
  subscription_id   = var.subscription_id
  tenant_id         = var.tenant_id
}

provider "azuread" {
  # Configuration options
}



