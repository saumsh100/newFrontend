#!/usr/bin/env groovy
@Library('pipeline-library') _
import com.carecru.pipeline.library.deployment.Deployment

appGithubRepository = "frontend"
jenkinsNodeExecutor = "prod-jenkins-slave"
mainBranch = "master"
notifyChannelName = "eng-ccp"
migrationServiceName = "${appGithubRepository}-migrations"
seedServiceName = "${appGithubRepository}-seed"
caRegion = "ca-central-1"
usRegion = "us-west-1"
frontendDirectory = "."
frontendPortNumber = "80"

if (isPullRequest()) {
  caEnvironment           = "dev-${env.CHANGE_ID}"
  ecsClusterName          = "dev-ecs-cluster"
  frontendUrl             = "https://${caEnvironment}.carecru.com"
  execution_environment   = "DEVELOPMENT"
  frontendMySubdomain     = "${caEnvironment}"
} else if (isBranch(mainBranch)) {
  caEnvironment           = "dev"
  ecsClusterName          = "dev-ecs-cluster"
  frontendUrl             = "https://dev.carecru.com"
  execution_environment   = "DEVELOPMENT"
  frontendMySubdomain     = "${caEnvironment}"
} else {
  caEnvironment           = "prod"
  usEnvironment           = "prod-us"
  demoEnvironment         = "demo"
  ecsClusterName          = "prod-ecs-cluster"
  demoEcsClusterName      = "demo-ecs-cluster"
  frontendUrl             = "https://carecru.ca and https://carecru.io"
  execution_environment   = "PRODUCTION"
  frontendMySubdomain     = "my"
}

pipeline = new Deployment(this, caEnvironment, appGithubRepository)
migrationTaskDefinitionName = "${caEnvironment}-${migrationServiceName}"
seedTaskDefinitionName = "${caEnvironment}-${seedServiceName}"
services = ["${appGithubRepository}": "infra/Dockerfile"]

def parallelBuildDockerImage(Deployment pipeline, String region, String environment) {
  String dockerVersionTag = pipeline.gitCommitNumber()
  def parallelServiceNames = [:]
  services.each { service ->
    def serviceName = service.getKey()
    def dockerfile = service.getValue()
    if (isProduction()) {
      parallelServiceNames["${serviceName}-ca"] = {
        pipeline.buildFrontendDockerImage(serviceName, dockerfile, dockerVersionTag, region, environment, frontendDirectory, frontendPortNumber, frontendMySubdomain)
      }
      parallelServiceNames["${serviceName}-us"] = {
        pipeline.buildFrontendDockerImage(serviceName, dockerfile, dockerVersionTag, usRegion, usEnvironment, frontendDirectory, frontendPortNumber, frontendMySubdomain)
      }
      parallelServiceNames["${serviceName}-demo"] = {
        pipeline.buildFrontendDockerImage(serviceName, dockerfile, dockerVersionTag, caRegion, demoEnvironment, frontendDirectory, frontendPortNumber, "demo")
      }
    } else {
      parallelServiceNames[serviceName] = {
        pipeline.buildDockerImageForFrontend(serviceName, dockerfile, caEnvironment, frontendDirectory, frontendPortNumber, frontendMySubdomain)
      }
    }
  }
  return parallelServiceNames
}

def parallelDeployApp(Deployment pipeline, String region, String environment) {
  String dockerVersionTag = pipeline.gitCommitNumber()
  def parallelServiceNames = [:]
  services.keySet().each { service ->
    def serviceName = service
    if (isProduction()) {
      parallelServiceNames["${serviceName}-ca"] = {
        pipeline.deployApp(serviceName, region, environment, dockerVersionTag, ecsClusterName, appGithubRepository)
      }
      parallelServiceNames["${serviceName}-us"] = {
        pipeline.deployApp(serviceName, usRegion, usEnvironment, dockerVersionTag, ecsClusterName, appGithubRepository)
      }
      parallelServiceNames["${serviceName}-demo"] = {
        pipeline.deployApp(serviceName, caRegion, demoEnvironment, dockerVersionTag, demoEcsClusterName, appGithubRepository)
      }
    } else {
      parallelServiceNames[serviceName] = {
        pipeline.deployApplication(serviceName, environment, ecsClusterName, appGithubRepository)
      }
    }
  }
  return parallelServiceNames
}

node(jenkinsNodeExecutor) {
  try {
    pipeline.clearWorkspace()
    pipeline.checkout()
    if (isValidBranch(mainBranch) || isProduction()) {
      setVars(caRegion)
      if (isPullRequest()) {
        throttle(['noConcurrentJobs']) {
          node(jenkinsNodeExecutor) {
            checkout scm
            pipeline.deployEnvironment()
            deleteDir()
          }
        }
      }
      stage('Build Docker Images') {
        parallel parallelBuildDockerImage(pipeline, caRegion, caEnvironment)
      }
      if (isPullRequest()) {
        pipeline.runMigrationsOrSeed(migrationTaskDefinitionName, ecsClusterName, caRegion)
        pipeline.runMigrationsOrSeed(seedTaskDefinitionName, ecsClusterName, caRegion)
      }
      stage('Deploy Application') {
        parallel parallelDeployApp(pipeline, caRegion, caEnvironment)
      }
    }
    currentBuild.result = "SUCCESS"
  } catch (Exception err) {
    println(err)
    currentBuild.result = "FAILURE"
  }
  finally {
    if (isValidBranch(mainBranch) || isProduction()) {
      if (isBranch(mainBranch)) {
        throttle(['noConcurrentJobs']) {
          node(jenkinsNodeExecutor) {
            checkout scm
            pipeline.destroyEnvironment()
            deleteDir()
          }
        }
      }
      pipeline.notifyBuild(frontendUrl, notifyChannelName)
    }
    deleteDir()
  }
}
