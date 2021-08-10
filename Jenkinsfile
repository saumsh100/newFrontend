#!/usr/bin/env groovy
@Library('pipeline-library') _
import com.carecru.pipeline.library.deployment.Deployment

try {
  if (version) {}
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
    parallelServiceNames["${appName}-dev"] = {
      pipeline.buildDockerImageForFrontend(appName, dockerfilePath, environment, frontendDirectory, environment)
    }
    if (isBranch(mainBranch)) {
      parallelServiceNames["${appName}-test"] = {
        pipeline.buildDockerImageForFrontend(appName, dockerfilePath, "test", frontendDirectory, "test")
      }
      parallelServiceNames["${appName}-prod-ca"] = {
        pipeline.buildDockerImageForFrontend(appName, dockerfilePath, "prod", frontendDirectory, "my")
      }
      parallelServiceNames["${appName}-prod-us"] = {
        pipeline.buildDockerImageForFrontend(appName, dockerfilePath, "prod-us", frontendDirectory, "my")
      }
      parallelServiceNames["${appName}-demo"] = {
        pipeline.buildDockerImageForFrontend(appName, dockerfilePath, "demo", frontendDirectory, "demo")
      }
    }
  }
  return parallelServiceNames
}

def parallelDeployApp(Deployment pipeline, String environment, String ecsClusterName, String version) {
  def serviceName = [:]
  services.keySet().each { appName ->
    serviceName["${appName}-ca"] = {
      pipeline.deployApplication(appName, environment, ecsClusterName, appName, environment == "prod" ? "prod_" + version : (
        environment == "test" ? "test_" + version : version )
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

def parallelRunMigrations(Deployment pipeline, String environment, String ecsClusterName, String version) {
  def serviceName = [:]
  serviceName["migrations"] = {
    pipeline.executeMigrationsOrSeed("${environment}-${mainApp}-migrations", ecsClusterName, "api", version, null, null)
  }
  return serviceName
}

node(jenkinsNodeExecutor) {
  try {
    if (isValidDeploy(mainBranch) ) {
      pipeline = new Deployment(this, getVars('environment'), mainApp)
      setVars("ca-central-1")
      pipeline.clearWorkspace()
      if (isValidBranch(mainBranch)) {
        pipeline.checkout()
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
          parallel parallelBuildDockerImage(pipeline, getVars('environment'))
        }
      }
      if (isPullRequest()) {
        stage('Execute Migrations') {
          parallel parallelRunMigrations(pipeline, getVars('environment'), getVars('ecsClusterName'), version)
        }
        stage('Execute Seed') {
          pipeline.executeMigrationsOrSeed("${getVars('environment')}-${mainApp}-seed", getVars('ecsClusterName'), mainApp, version)
        }
      }
      stage('Application Deployments') {
        parallel parallelDeployApp(pipeline, getVars('environment'), getVars('ecsClusterName'), version)
      }
    }
    currentBuild.result = "SUCCESS"
  } catch (Exception err) {
    println(err)
    currentBuild.result = "FAILURE"
  }
  finally {
    if (isValidDeploy(mainBranch) ) {
      if (isBranch(mainBranch)) {
        throttle(['noConcurrentJobs']) {
          node(jenkinsNodeExecutor) {
            checkout scm
            pipeline.destroyEnvironment()
            deleteDir()
          }
        }
      }
      pipeline.notifyBuild(getVars('frontendUrl'), notifyChannelName)
      deleteDir()
    }
  }
}