variable "location" {
  type        = string
  description = "Sets the default location used for resource deployments where needed."
  default     = "westus2"
}

variable "document_intelligen_location" {
  type        = string
  description = "Sets the default location used for document intelligen."
  # suggest East US, West US2, West Europe
  default     = "westus2"
  validation {
    condition     =  contains(["eastus", "westus2", "westeurope"], var.document_intelligen_location)
    error_message = "Location must be one of:  (eastus, westus2, westeurope)"
  }
}


variable "app_location" {
  type        = string
  description = "Sets the app location used for resource deployments where needed and have the quota."
  # suggest East US, West US2, West Europe
  default     = "eastus"
}

variable "cosmodb_location" {
  type        = string
  description = "Sets the default location used for resource deployments where needed and have the quota"
  # suggest East US, West US2, West Europe
  default     = "westus2"
}

variable "static_web_location" {
  type        = string
  description = "Sets the default location used for resource deployments where needed and have the quota"
  # only available in westus2,centralus,eastus2,westeurope,eastasia
  default     = "eastus2"
}

variable "resource_group_name" {
  type        = string
  description = "Sets the name of the resource group to be created."
  default     = "AI-GBB-Platform-rg"
}

variable "AZURE_OPENAI_EMB_MODEL" {
  type        = string
  description = "This is the key for your azure openAI embedding model name."
  default     = "text-embedding-ada-002"
}

variable "dist_folder_path" {
  type        = string
  description = "This is the dist folder path."
  default     = "./frontend/"
  
}

variable "src_folder_path" {
  type        = string
  description = "This is the src folder path."
 default     = "../frontend/"
  
}

variable "use_authetication" {
  type        = bool
  description = "The backend app if  authenticate the frontend's token."
  default     = true
  
}

variable "enforce_access_control" {
  type        = bool
  description = "The backend app if  enforce access control."
  default     = true
  
}
