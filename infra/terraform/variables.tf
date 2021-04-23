variable "aws_dns_account_access_key" {}

variable "aws_dns_account_secret_key" {}

variable "app_name" {
  default = "frontend"
}

variable "postgres" {
  default = {
    postgres_user     = "pgadmin"
    postgres_password = "pgadminPassword"
    postgres_db       = "postgresDb"
  }
}

variable "loki_url" {
  default = "http://dev-loki.carecru.com:3100/loki/api/v1/push"
}

variable "api_image" {
  default = "453923235837.dkr.ecr.ca-central-1.amazonaws.com/test-api:latest-master"
}

variable "backend_image" {
  default = "453923235837.dkr.ecr.ca-central-1.amazonaws.com/test-backend:latest-master"
}

variable "certificate_arn" {
  default = "arn:aws:acm:ca-central-1:453923235837:certificate/3709c728-1c54-40e5-8f76-9192095a875a"
}

variable "frontend_port" {
  default = 80
}

variable "backend_port" {
  default = 11001
}

variable "api_port" {
  default = 11002
}

variable "migration_command" {
  default = [
    "npm",
    "run",
    "migration:run"
  ]
}

variable "seed_command" {
  default = [
    "npm",
    "run",
    "seed"
  ]
}

variable "postgres_command" {
  default = [
    "postgres",
    "-N",
    "500"
  ]
}

variable "secrets" {
  default = [
    {
      "name" : "NPM_TOKEN",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/NPM_TOKEN"
    },
    {
      "name" : "CALLRAIL_API_ACCOUNTID",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/CALLRAIL_API_ACCOUNTID"
    },
    {
      "name" : "CALLRAIL_API_KEY",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/CALLRAIL_API_KEY"
    },
    {
      "name" : "JOTFORM_API_KEY",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/JOTFORM_API_KEY"
    },
    {
      "name" : "LAUNCH_DARKLY_SDK_KEY",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/LAUNCH_DARKLY_SDK_KEY"
    },
    {
      "name" : "MANDRILL_API_KEY",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/MANDRILL_API_KEY"
    },
    {
      "name" : "MODE_ANALYTICS_SECRET",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/MODE_ANALYTICS_SECRET"
    },
    {
      "name" : "MODE_ANALYTICS_ACCESS_KEY",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/MODE_ANALYTICS_ACCESS_KEY"
    },
    {
      "name" : "GOOGLE_API_KEY",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/GOOGLE_API_KEY"
    },
    {
      "name" : "FEATURE_FLAG_KEY",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/FEATURE_FLAG_KEY"
    },
    {
      "name" : "REBRANDLY_API_KEY",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/REBRANDLY_API_KEY"
    },
    {
      "name" : "TWILIO_ACCOUNT_SID",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/TWILIO_ACCOUNT_SID"
    },
    {
      "name" : "TWILIO_AUTH_TOKEN",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/TWILIO_AUTH_TOKEN"
    },
    {
      "name" : "TWILIO_NUMBER",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/TWILIO_NUMBER"
    },
    {
      "name" : "VENDASTA_API_KEY",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/VENDASTA_API_KEY"
    },
    {
      "name" : "VENDASTA_API_USER",
      "valueFrom" : "arn:aws:ssm:ca-central-1:453923235837:parameter/VENDASTA_API_USER"
    }
  ]
}
