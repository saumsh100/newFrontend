terraform {
  backend "s3" {
    encrypt = true
    bucket  = "carecru-terraform-state"
    region  = "ca-central-1"
    key     = "isolated-frontend/terraform.tfstate"
  }
}
