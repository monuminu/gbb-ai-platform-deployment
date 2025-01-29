terraform {
  backend "local" {}

  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.101.0"

    }
    
    azuread = {
      source = "hashicorp/azuread"
      version = "2.48.0"
    }

    random = {
      source = "hashicorp/random"
    }

    azapi = {
      source = "Azure/azapi"
      version = "1.13.1"
    }
  }
}

