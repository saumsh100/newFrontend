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
  frontendUrl             = "https://${caEnvironment}-${appGithubRepository}.carecru.com"
  execution_environment   = "DEVELOPMENT"
  frontendMySubdomain     = "${caEnvironment}-${appGithubRepository}"
} else if (isBranch(mainBranch)) {
  caEnvironment           = "test"
  ecsClusterName          = "test-ecs-cluster"
  frontendUrl             = "https://test.carecru.com"
  execution_environment   = "TEST"
  frontendMySubdomain     = "${caEnvironment}"
} else {
  caEnvironment             = "prod"
  usEnvironment             = "prod-us"
  ecsClusterName            = "prod-ecs-cluster"
  frontendUrl               = "https://carecru.ca and https://carecru.io"
  execution_environment     = "PRODUCTION"
  frontendMySubdomain       = "my"
}

pipeline = new Deployment(this, caEnvironment, appGithubRepository)
migrationTaskDefinitionName = "${caEnvironment}-${migrationServiceName}"
seedTaskDefinitionName = "${caEnvironment}-${seedServiceName}"
services = ["${appGithubRepository}": "infra/Dockerfile"]

def parallelBuildDockerImage(Deployment pipeline, String region, String environment) {
  String dockerVersionTag = pipeline.gitCommitNumber()
  def serviceName = [:]
  services.each { service ->
    def newServiceName = service
    serviceName[newServiceName.getKey()] = {
      pipeline.buildFrontendDockerImage(newServiceName.getKey(), newServiceName.getValue(), dockerVersionTag, region, environment, frontendDirectory, frontendPortNumber, frontendMySubdomain)
    }
  }
  return serviceName
}

def parallelDeployApp(Deployment pipeline, String region, String environment) {
  String dockerVersionTag = pipeline.gitCommitNumber()
  def serviceName = [:]
  services.keySet().each { service ->
    def newServiceName = service
    serviceName[newServiceName] = {
      pipeline.deployApp(newServiceName, region, environment, dockerVersionTag, ecsClusterName, appGithubRepository)
    }
  }
  return serviceName
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
      stage('Build CA Docker Images') {
        parallel parallelBuildDockerImage(pipeline, caRegion, caEnvironment)
      }
      if (isProduction()) {
        setVars(usRegion)
        stage('Build US Docker Images') {
          parallel parallelBuildDockerImage(pipeline, usRegion, usEnvironment)
        }
      }
      setVars(caRegion)
      if (isPullRequest()) {
        pipeline.runMigrationsOrSeed(migrationTaskDefinitionName, ecsClusterName)
        pipeline.runMigrationsOrSeed(seedTaskDefinitionName, ecsClusterName)
      }
      stage('Deploy CA App') {
        parallel parallelDeployApp(pipeline, caRegion, caEnvironment)
      }
      if (isProduction()) {
        setVars(usRegion)
        stage('Deploy US App') {
          parallel parallelDeployApp(pipeline, usRegion, usEnvironment)
        }
      }
    }
    currentBuild.result = "SUCCESS"
  } catch (Exception err) {
    println(err)
    currentBuild.result = "FAILURE"
  }
  finally {
    if (isValidBranch(mainBranch) || isProduction()) {
      pipeline.deleteLocalDockerImages()
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
