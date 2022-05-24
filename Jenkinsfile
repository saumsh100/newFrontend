#!/usr/bin/env groovy
@Library('pipeline-library@1.0.9') _
import com.carecru.pipeline.library.deployment.Deployment

try {
  if (version) {
  }
} catch (Exception e) {
  version = null
}

mainApp = "frontend"
jenkinsNodeExecutor = "prod-jenkins-slave"
mainBranch = "master"
notifyChannelName = "eng-ccp"
usRegion = "us-west-1"
frontendDirectory = "."

services = ["${mainApp}": "infra/Dockerfile"]

def parallelBuildDockerImage(Deployment pipeline, String environment) {
  def parallelServiceNames = [:]
  services.each { service ->
    def appName = service.getKey()
    def dockerfilePath = service.getValue()
    def useIdentityAccessProxy = true
    parallelServiceNames["${appName}-dev"] = {
      pipeline.buildDockerImageForFrontend(appName, dockerfilePath, "dev", frontendDirectory, "dev", useIdentityAccessProxy)
    }
    parallelServiceNames["${appName}-test"] = {
      pipeline.buildDockerImageForFrontend(appName, dockerfilePath, "test", frontendDirectory, "test", useIdentityAccessProxy)
    }
    parallelServiceNames["${appName}-demo"] = {
      pipeline.buildDockerImageForFrontend(appName, dockerfilePath, "demo", frontendDirectory, "demo")
    }
    parallelServiceNames["${appName}-prod-ca"] = {
      pipeline.buildDockerImageForFrontend(appName, dockerfilePath, "prod", frontendDirectory, "my", useIdentityAccessProxy)
    }
    parallelServiceNames["${appName}-prod-us"] = {
      pipeline.buildDockerImageForFrontend(appName, dockerfilePath, "prod-us", frontendDirectory, "my", useIdentityAccessProxy)
    }
  }
  return parallelServiceNames
}

def parallelDeployApp(Deployment pipeline, String environment, String ecsClusterName, String version) {
  def serviceName = [:]
  services.keySet().each { appName ->
    serviceName["${appName}-ca"] = {
      pipeline.deployApplication(appName, environment, ecsClusterName, appName, environment == "prod" ? "prod_" + version : (
        environment == "test" ? "test_" + version : version)
      )
    }
    if (isProduction()) {
      serviceName["${appName}-us"] = {
        pipeline.deployApplication(appName, "${environment}-us", ecsClusterName, appName, "prod-us_" + version, usRegion)
      }
      serviceName["${appName}-demo"] = {
        pipeline.deployApplication(appName, "demo", "demo-ecs-cluster", appName, "demo_" + version)
      }
    }
  }
  return serviceName
}

node(jenkinsNodeExecutor) {
  try {
    if (isValidDeploy(mainBranch)) {
      pipeline = new Deployment(this, getVars('environment'), mainApp)
      setVars("ca-central-1")
      pipeline.clearWorkspace()
      if (isValidBranch(mainBranch)) {
        pipeline.checkout()
        stage('Build Docker Images') {
          parallel parallelBuildDockerImage(pipeline, getVars('environment'))
        }
      }
      if (!isPullRequest()) {
        stage('Application Deployments') {
          parallel parallelDeployApp(pipeline, getVars('environment'), getVars('ecsClusterName'), version)
        }
      }
    }
    currentBuild.result = "SUCCESS"
  } catch (Exception err) {
    println(err)
    currentBuild.result = "FAILURE"
  }
  finally {
    if (isValidDeploy(mainBranch)) {
      pipeline.notifyBuild(getVars('frontendUrl'), notifyChannelName)
      deleteDir()
    }
  }
}
