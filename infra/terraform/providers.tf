provider "aws" {
  region  = module.env_var_map.region
}

provider "aws" {
  region      = module.env_var_map.region
  alias       = "aws_dns_account"
  access_key  = var.aws_dns_account_access_key
  secret_key  = var.aws_dns_account_secret_key
}