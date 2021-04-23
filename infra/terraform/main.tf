locals {
  env_with_app_name = "${terraform.workspace}-${var.app_name}"
  backend_vars = {
    AWS_ACCESS_KEY_ID     = var.aws_dns_account_access_key
    AWS_SECRET_ACCESS_KEY = var.aws_dns_account_secret_key
    GRAPHQL_SERVER_URL    = "http://${module.api.alb_dns_name}:${var.api_port}/graphql"
    NEW_API_URL           = "http://${module.api.alb_dns_name}:${var.api_port}"
    region                = module.env_var_map.region
    HOST                  = "${terraform.workspace}-backend.careru.com"
    PORT                  = var.backend_port
    POSTGRESQL_DATABASE   = var.postgres.postgres_db
    POSTGRESQL_HOST       = module.postgres.alb_dns_name
    POSTGRESQL_PASSWORD   = var.postgres.postgres_password
    POSTGRESQL_USER       = var.postgres.postgres_user
    RABBITMQ_URL          = "amqp://guest:guest@${module.rabbitmq.alb_dns_name}:5672"
    REDIS_HOST            = module.redis.alb_dns_name
  }
  api_vars = {
    POSTGRESQL_PASSWORD = var.postgres.postgres_password
    TYPEORM_HOST        = module.postgres.alb_dns_name
    TYPEORM_USERNAME    = var.postgres.postgres_user
    TYPEORM_DATABASE    = var.postgres.postgres_db
    REDIS_HOST          = module.redis.alb_dns_name
    APP_PORT            = var.api_port
    sequelize_pool_max  = "35"
    sequelize_pool_min  = "25"
  }
}

module "env_var_map" {
  source = "git::https://github.com/CareCru/terraform-modules.git//env_var_map?ref=v3.2.27"
  env    = "dev"
}

module "postgres" {
  source = "git::https://github.com/CareCru/terraform-modules.git//new-app?ref=v3.2.27"

  environment            = terraform.workspace
  region                 = module.env_var_map.region
  vpc_name               = module.env_var_map.vpc_name
  vpc_id                 = module.env_var_map.vpc_id
  ecs_cluster_arn        = module.env_var_map.ecs_cluster_arn
  private_subnet_ids     = module.env_var_map.private_subnet_ids
  public_subnet_ids      = module.env_var_map.public_subnet_ids
  ecs_cluster_name       = module.env_var_map.ecs_cluster_name
  s3_for_elb_logs        = false
  load_balancer_type     = "network"
  health_check_interval  = 10
  code_pipeline          = false
  ecr_creation           = false
  internet_load_balancer = false
  healthy_threshold      = 3
  unhealthy_threshold    = 3
  application_name       = "${var.app_name}-postgres"
  ecs_service_name       = "${var.app_name}-postgres"
  app_port               = "5432"
  nlb_sg_port_number     = [5432]
  container_name         = "${local.env_with_app_name}-postgres"
  desired_count          = 1

  container_definition = templatefile("databases/container_definition.json", {
    container_name = "${local.env_with_app_name}-postgres"
    docker_image   = "public.ecr.aws/carecru/docker-images:postgres-ssl-9.6"
    app_port       = 5432
    loki_url       = var.loki_url
    command        = jsonencode(var.postgres_command)
    env_var_file = templatefile("databases/postgres-env-vars.json", {
      postgres_user     = var.postgres.postgres_user
      postgres_password = var.postgres.postgres_password
      postgres_db       = var.postgres.postgres_db
    })
  })
}

module "redis" {
  source = "git::https://github.com/CareCru/terraform-modules.git//new-app?ref=v3.2.27"

  environment            = terraform.workspace
  region                 = module.env_var_map.region
  vpc_name               = module.env_var_map.vpc_name
  vpc_id                 = module.env_var_map.vpc_id
  ecs_cluster_arn        = module.env_var_map.ecs_cluster_arn
  private_subnet_ids     = module.env_var_map.private_subnet_ids
  public_subnet_ids      = module.env_var_map.public_subnet_ids
  ecs_cluster_name       = module.env_var_map.ecs_cluster_name
  s3_for_elb_logs        = false
  health_check_interval  = 10
  code_pipeline          = false
  load_balancer_type     = "network"
  ecr_creation           = false
  internet_load_balancer = false
  application_name       = "${var.app_name}-redis"
  ecs_service_name       = "${var.app_name}-redis"
  app_port               = "6379"
  healthy_threshold      = 3
  unhealthy_threshold    = 3
  nlb_sg_port_number     = [6379]
  container_name         = "${local.env_with_app_name}-redis"
  desired_count          = 1

  container_definition = templatefile("databases/container_definition.json", {
    container_name = "${local.env_with_app_name}-redis"
    docker_image   = "public.ecr.aws/carecru/docker-images:redis-5-alpine"
    command        = jsonencode(null)
    app_port       = 6379
    loki_url       = var.loki_url
    env_var_file   = jsonencode([])
  })
}

module "rabbitmq" {
  source = "git::https://github.com/CareCru/terraform-modules.git//new-app?ref=v3.2.27"

  environment            = terraform.workspace
  region                 = module.env_var_map.region
  vpc_name               = module.env_var_map.vpc_name
  vpc_id                 = module.env_var_map.vpc_id
  ecs_cluster_arn        = module.env_var_map.ecs_cluster_arn
  private_subnet_ids     = module.env_var_map.private_subnet_ids
  public_subnet_ids      = module.env_var_map.public_subnet_ids
  ecs_cluster_name       = module.env_var_map.ecs_cluster_name
  s3_for_elb_logs        = false
  load_balancer_type     = "network"
  health_check_interval  = 10
  code_pipeline          = false
  ecr_creation           = false
  internet_load_balancer = false
  healthy_threshold      = 3
  unhealthy_threshold    = 3
  application_name       = "${var.app_name}-rabbitmq"
  ecs_service_name       = "${var.app_name}-rabbitmq"
  app_port               = "5672"
  nlb_sg_port_number     = [5672]
  container_name         = "${local.env_with_app_name}-rabbitmq"
  desired_count          = 1

  container_definition = templatefile("databases/container_definition.json", {
    container_name = "${local.env_with_app_name}-rabbitmq"
    docker_image   = "public.ecr.aws/carecru/docker-images:rabbitmq-alpine"
    app_port       = 5672
    command        = jsonencode(null)
    loki_url       = var.loki_url
    env_var_file   = jsonencode([])
  })
}

module "frontend" {
  source = "git::https://github.com/CareCru/terraform-modules.git//new-app?ref=v3.2.27"

  environment        = terraform.workspace
  region             = module.env_var_map.region
  vpc_name           = module.env_var_map.vpc_name
  vpc_id             = module.env_var_map.vpc_id
  private_subnet_ids = module.env_var_map.private_subnet_ids
  public_subnet_ids  = module.env_var_map.public_subnet_ids
  ecs_cluster_arn    = module.env_var_map.ecs_cluster_arn
  ecs_cluster_name   = module.env_var_map.ecs_cluster_name
  s3_for_elb_logs    = false

  health_check_interval  = 6
  deregistration_delay   = 5
  repository_name        = var.app_name
  code_pipeline          = false
  application_name       = var.app_name
  ecs_service_name       = var.app_name
  app_port               = var.frontend_port
  desired_count          = 1
  certificate_arn        = var.certificate_arn
  alb_sg_port_number     = [var.frontend_port, 443]
  http_to_https          = true
  internet_load_balancer = true
  container_name         = local.env_with_app_name
  app_health_check_path  = "/"
  container_definition = templatefile("container-definition.json", {
    app_port     = var.frontend_port
    entrypoint   = jsonencode(null)
    command      = jsonencode(null)
    secrets      = jsonencode(null)
    env_var_file = jsonencode(null)
    port_mappings = jsonencode([{
      "containerPort" : var.frontend_port,
      "hostPort" : var.frontend_port
    }])
    container_name     = local.env_with_app_name
    loki_url           = var.loki_url
    ecr_repository_url = module.frontend.ecr_repository_url
  })
}

module "frontend_records" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-route53.git//modules/records?ref=v1.5.0"
  providers = {
    aws = aws.aws_dns_account
  }
  zone_id = module.env_var_map.dns_carecru_com_CNAME.zone_id
  records = [
    {
      name    = local.env_with_app_name
      type    = "CNAME"
      ttl     = 3600
      records = [module.frontend.alb_dns_name]
    }
  ]
}

module "backend" {
  source = "git::https://github.com/CareCru/terraform-modules.git//new-app?ref=v3.2.27"

  environment            = terraform.workspace
  region                 = module.env_var_map.region
  vpc_name               = module.env_var_map.vpc_name
  vpc_id                 = module.env_var_map.vpc_id
  private_subnet_ids     = module.env_var_map.private_subnet_ids
  public_subnet_ids      = module.env_var_map.public_subnet_ids
  ecs_cluster_arn        = module.env_var_map.ecs_cluster_arn
  ecs_cluster_name       = module.env_var_map.ecs_cluster_name
  s3_for_elb_logs        = false
  health_check_interval  = 6
  code_pipeline          = false
  ecr_creation           = false
  deregistration_delay   = 5
  application_name       = "${var.app_name}-backend"
  ecs_service_name       = "${var.app_name}-backend"
  secrets                = var.secrets
  app_port               = var.backend_port
  certificate_arn        = var.certificate_arn
  desired_count          = 1
  alb_sg_port_number     = [var.backend_port, 80, 443]
  internet_load_balancer = true
  container_name         = "${terraform.workspace}-${var.app_name}-backend"
  loki_url               = var.loki_url
  env_var_file           = templatefile("backend-env-vars.json", local.backend_vars)
  container_definition = templatefile("container-definition.json", {
    loki_url           = var.loki_url
    container_name     = "${terraform.workspace}-${var.app_name}-backend"
    ecr_repository_url = var.backend_image
    command            = jsonencode(null)
    secrets            = jsonencode(var.secrets)
    port_mappings = jsonencode([{
      "containerPort" : var.backend_port,
      "hostPort" : var.backend_port
    }])
    env_var_file = templatefile("backend-env-vars.json", local.backend_vars)
  })
}

module "backend_dns" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-route53.git//modules/records?ref=v1.5.0"
  providers = {
    aws = aws.aws_dns_account
  }
  zone_id = module.env_var_map.dns_carecru_com_CNAME.zone_id
  records = [
    {
      name    = "${terraform.workspace}-backend"
      type    = "CNAME"
      ttl     = 3600
      records = [module.backend.alb_dns_name]
    }
  ]
}

module "api" {
  source = "git::https://github.com/CareCru/terraform-modules.git//new-app?ref=v3.2.27"

  environment            = terraform.workspace
  region                 = module.env_var_map.region
  vpc_name               = module.env_var_map.vpc_name
  vpc_id                 = module.env_var_map.vpc_id
  private_subnet_ids     = module.env_var_map.private_subnet_ids
  public_subnet_ids      = module.env_var_map.public_subnet_ids
  ecs_cluster_arn        = module.env_var_map.ecs_cluster_arn
  ecs_cluster_name       = module.env_var_map.ecs_cluster_name
  s3_for_elb_logs        = false
  health_check_interval  = 50
  healthy_threshold      = 2
  code_pipeline          = false
  ecr_creation           = false
  application_name       = "${var.app_name}-api"
  ecs_service_name       = "${var.app_name}-api"
  app_port               = var.api_port
  deregistration_delay   = 10
  app_health_check_path  = "/api"
  desired_count          = 1
  alb_sg_port_number     = [var.api_port, 80, 443]
  internet_load_balancer = false
  container_name         = "${terraform.workspace}-${var.app_name}-api"
  container_definition = templatefile("container-definition.json", {
    loki_url           = var.loki_url
    container_name     = "${terraform.workspace}-${var.app_name}-api"
    ecr_repository_url = var.api_image
    command            = jsonencode(null)
    secrets            = jsonencode(null)
    port_mappings = jsonencode([{
      "containerPort" : var.api_port,
      "hostPort" : var.api_port
    }])
    env_var_file = templatefile("api-env-vars.json", local.api_vars)
  })
}

resource "aws_ecs_task_definition" "migrations" {
  family             = "${local.env_with_app_name}-migrations"
  execution_role_arn = module.api.execution_role_arn
  container_definitions = templatefile("container-definition.json", merge(local.api_vars, {
    loki_url           = var.loki_url
    ecr_repository_url = var.api_image
    command            = jsonencode(var.migration_command)
    port_mappings      = jsonencode(null)
    secrets            = jsonencode(null)
    container_name     = "${local.env_with_app_name}-migrations"
    env_var_file       = templatefile("api-env-vars.json", local.api_vars)
  }))
  tags = {
    environment = terraform.workspace
    region      = module.env_var_map.region
    vpc-name    = module.env_var_map.vpc_name
    vpc-id      = module.env_var_map.vpc_id
  }
}

resource "aws_ecs_task_definition" "seed" {
  family             = "${local.env_with_app_name}-seed"
  execution_role_arn = module.backend.execution_role_arn
  container_definitions = templatefile("container-definition.json", {
    loki_url           = var.loki_url
    container_name     = "${local.env_with_app_name}-seed"
    ecr_repository_url = var.backend_image
    command            = jsonencode(var.seed_command)
    port_mappings      = jsonencode(null)
    secrets            = jsonencode(var.secrets)
    env_var_file       = templatefile("backend-env-vars.json", local.backend_vars)
  })
  tags = {
    environment = terraform.workspace
    region      = module.env_var_map.region
    vpc-name    = module.env_var_map.vpc_name
    vpc-id      = module.env_var_map.vpc_id
  }
}
