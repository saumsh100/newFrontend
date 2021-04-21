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

if (isPullRequest()) {
  caEnvironment           = "dev-${env.CHANGE_ID}"
  ecsClusterName          = "dev-ecs-cluster"
  frontendUrl             = "https://${caEnvironment}-${appGithubRepository}.carecru.com"
  execution_environment   = "DEVELOPMENT"
  my_subdomain            = "${caEnvironment}-${appGithubRepository}"
} else if (isBranch(mainBranch)) {
  caEnvironment           = "test"
  ecsClusterName          = "test-ecs-cluster"
  frontendUrl             = "https://test.carecru.com"
  execution_environment   = "TEST"
  my_subdomain            = "${caEnvironment}"
} else {
  caEnvironment             = "prod"
  usEnvironment             = "prod-us"
  ecsClusterName            = "prod-ecs-cluster"
  frontendUrl               = "https://carecru.ca and https://carecru.io"
  execution_environment     = "PRODUCTION"
  my_subdomain              = "my"
}

pipeline = new Deployment(this, caEnvironment, appGithubRepository)
migrationTaskDefinitionName = "${caEnvironment}-${migrationServiceName}"
seedTaskDefinitionName = "${caEnvironment}-${seedServiceName}"
services = ["${appGithubRepository}": "infra/Dockerfile"]

def npmrcGenerate(String npmrcDir) {
  withCredentials([string(credentialsId: 'NPM_TOKEN', variable: 'NPM_TOKEN'),string(credentialsId: 'FORT_AWESOME_NPM_TOKEN', variable: 'FORT_AWESOME_NPM_TOKEN')]) {
    dir(npmrcDir) {
      sh """
        cat <<< '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc
        cat <<< '@fortawesome:registry=https://npm.fontawesome.com/' >> .npmrc
        cat <<< '//npm.fontawesome.com/:_authToken=${FORT_AWESOME_NPM_TOKEN}' >> .npmrc
      """
    }
  }
}

def buildDockerImage(String appName, String dockerfilePath, String dockerVersionTag, String region, String environment) {
  withCredentials([string(credentialsId: 'aws_account_id', variable: 'aws_account_id'),
    string(credentialsId: 'NPM_TOKEN', variable: 'NPM_TOKEN'),
    string(credentialsId: 'FEATURE_FLAG_KEY', variable: 'FEATURE_FLAG_KEY'),
    string(credentialsId: 'MODE_ANALYTICS_ACCESS_KEY', variable: 'MODE_ANALYTICS_ACCESS_KEY'),
    string(credentialsId: 'GOOGLE_API_KEY', variable: 'GOOGLE_API_KEY'),
    string(credentialsId: 'INTERCOM_APP_ID', variable: 'INTERCOM_APP_ID')]) {
    npmrcGenerate(WORKSPACE)
    sh """
      cd ${env.WORKSPACE}
      docker build -t ${aws_account_id}.dkr.ecr.${region}.amazonaws.com/${environment}-${appName}:latest -f ${dockerfilePath} . \
        --build-arg NPM_TOKEN=${NPM_TOKEN} \
        --build-arg FEATURE_FLAG_KEY=${FEATURE_FLAG_KEY} \
        --build-arg GOOGLE_API_KEY=${GOOGLE_API_KEY} \
        --build-arg MODE_ANALYTICS_ACCESS_KEY=${MODE_ANALYTICS_ACCESS_KEY} \
        --build-arg EXECUTION_ENVIRONMENT=${execution_environment} \
        --build-arg INTERCOM_APP_ID=${INTERCOM_APP_ID} \
        --build-arg WORKFLOW_HOST=https://${environment}-workflow-frontend.carecru.com \
        --build-arg API_SERVER="https://${environment}-backend.carecru.com" \
        --build-arg MY_SUBDOMAIN=${my_subdomain} \
        --build-arg PORT=80 \
        --build-arg LIVESESSION_ID=a5443281.12543338
      docker tag ${aws_account_id}.dkr.ecr.${region}.amazonaws.com/${environment}-${appName}:latest ${aws_account_id}.dkr.ecr.${region}.amazonaws.com/${environment}-${appName}:${dockerVersionTag}
      aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${aws_account_id}.dkr.ecr.${region}.amazonaws.com
      docker push ${aws_account_id}.dkr.ecr.${region}.amazonaws.com/${environment}-${appName}:latest
      docker push ${aws_account_id}.dkr.ecr.${region}.amazonaws.com/${environment}-${appName}:${dockerVersionTag}
    """
    if (isBranch(mainBranch)) {
      sh """
        docker tag ${aws_account_id}.dkr.ecr.${region}.amazonaws.com/${environment}-${appName}:latest \
          ${aws_account_id}.dkr.ecr.${region}.amazonaws.com/test-${appName}:latest-master
        docker push ${aws_account_id}.dkr.ecr.${region}.amazonaws.com/test-${appName}:latest-master
      """
    }
  }
}

def parallelBuildDockerImage(Deployment pipeline, String region, String environment) {
  String dockerVersionTag = pipeline.gitCommitNumber()
  def serviceName = [:]
  services.each { service ->
    def newServiceName = service
    serviceName[newServiceName.getKey()] = {
      buildDockerImage(newServiceName.getKey(), newServiceName.getValue(), dockerVersionTag, region, environment)
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
