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
    parallelServiceNames["${serviceName}-ca"] = {
      pipeline.buildFrontendDockerImage(serviceName, dockerfile, dockerVersionTag, region, environment, frontendDirectory, frontendPortNumber, frontendMySubdomain)
    }
    if (isProduction()) {
      parallelServiceNames["${serviceName}-us"] = {
        pipeline.buildFrontendDockerImage(serviceName, dockerfile, dockerVersionTag, usRegion, usEnvironment, frontendDirectory, frontendPortNumber, frontendMySubdomain)
      }
      parallelServiceNames["${serviceName}-demo"] = {
        pipeline.buildFrontendDockerImage(serviceName, dockerfile, dockerVersionTag, caRegion, demoEnvironment, frontendDirectory, frontendPortNumber, frontendMySubdomain)
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
    parallelServiceNames["${serviceName}-ca"] = {
      pipeline.deployApp(serviceName, region, environment, dockerVersionTag, ecsClusterName, appGithubRepository)
    }
    if (isProduction()) {
      parallelServiceNames["${serviceName}-us"] = {
        setVars(usRegion)
        pipeline.deployApp(serviceName, usRegion, usEnvironment, dockerVersionTag, ecsClusterName, appGithubRepository)
      }
      parallelServiceNames["${serviceName}-demo"] = {
        setVars(caRegion)
        pipeline.deployApp(serviceName, caRegion, demoEnvironment, dockerVersionTag, demoEcsClusterName, appGithubRepository)
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
        pipeline.runMigrationsOrSeed(migrationTaskDefinitionName, ecsClusterName)
        pipeline.runMigrationsOrSeed(seedTaskDefinitionName, ecsClusterName)
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
      stage("Delete Local Docker Images") {
        pipeline.removeLocalDockerImages(caEnvironment, caRegion, appGithubRepository)
        if (isProduction()) {
          pipeline.removeLocalDockerImages(usEnvironment, usRegion, appGithubRepository)
        }
      }
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
