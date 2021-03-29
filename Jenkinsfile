#!/usr/bin/env groovy
@Library('pipeline-library') _
import com.carecru.pipeline.library.deployment.Deployment

appGithubRepository = "frontend"
jenkinsNodeExecutor = "prod-jenkins-slave"
mainBranch = "master"
notifyChannelName = "eng-ccp"
migrationServiceName = "${appGithubRepository}-migrations"
seedServiceName = "${appGithubRepository}-seed"

if (isPullRequest()) {
  environment           = "dev-${env.CHANGE_ID}"
  ecsClusterName        = "dev-ecs-cluster"
  frontendUrl           = "https://${environment}-${appGithubRepository}.carecru.com"
  mfeWorkflowServiceUrl = "https://test-workflow-service-frontend.carecru.com"
} else if (isBranch(mainBranch)) {
  environment           = "test"
  ecsClusterName        = "test-ecs-cluster"
  frontendUrl           = "https://carecru.tech"
  mfeWorkflowServiceUrl = "https://test-workflow-service-frontend.carecru.com"
} else {
  environment           = "dev"
  ecsClusterName        = "dev-ecs-cluster"
  frontendUrl           = null
  mfeWorkflowServiceUrl = null
}

services = ["${appGithubRepository}": "infra/Dockerfile"]
pipeline = new Deployment(this, environment, appGithubRepository)
migrationTaskDefinitionName = "${environment}-${migrationServiceName}"
seedTaskDefinitionName = "${environment}-${seedServiceName}"
backendUrl = "https://${environment}-backend.carecru.com"

def setVars() {
  withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'cicarecru', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
    env.AWS_ACCESS_KEY_ID = "${AWS_ACCESS_KEY_ID}"
    env.AWS_SECRET_ACCESS_KEY = "${AWS_SECRET_ACCESS_KEY}"
    env.AWS_DEFAULT_REGION = "ca-central-1"
  }
}

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

def buildDockerImage(String appName, String dockerfilePath, String dockerVersionTag) {
  withCredentials([string(credentialsId: 'aws_account_id', variable: 'aws_account_id'),
    string(credentialsId: 'NPM_TOKEN', variable: 'NPM_TOKEN'),
    string(credentialsId: 'FEATURE_FLAG_KEY', variable: 'FEATURE_FLAG_KEY'),
    string(credentialsId: 'GOOGLE_API_KEY', variable: 'GOOGLE_API_KEY'),
    string(credentialsId: 'INTERCOM_APP_ID', variable: 'INTERCOM_APP_ID')]) {
    npmrcGenerate(WORKSPACE)
    sh """
      export appNameForRepo=carecru
      cd ${env.WORKSPACE}
      docker build -t ${aws_account_id}.dkr.ecr.ca-central-1.amazonaws.com/${environment}-${appName}:latest -f ${dockerfilePath} . \
        --build-arg NPM_TOKEN=${NPM_TOKEN} \
        --build-arg FEATURE_FLAG_KEY=${FEATURE_FLAG_KEY} \
        --build-arg GOOGLE_API_KEY=${GOOGLE_API_KEY} \
        --build-arg INTERCOM_APP_ID=${INTERCOM_APP_ID} \
        --build-arg WORKFLOW_HOST=${mfeWorkflowServiceUrl} \
        --build-arg API_SERVER_HOST=https://${environment}-backend.carecru.com
      docker tag ${aws_account_id}.dkr.ecr.ca-central-1.amazonaws.com/${environment}-${appName}:latest ${aws_account_id}.dkr.ecr.ca-central-1.amazonaws.com/${environment}-${appName}:${dockerVersionTag}
      aws ecr get-login-password --region ca-central-1 | docker login --username AWS --password-stdin ${aws_account_id}.dkr.ecr.ca-central-1.amazonaws.com
      docker push ${aws_account_id}.dkr.ecr.ca-central-1.amazonaws.com/${environment}-${appName}:latest
      docker push ${aws_account_id}.dkr.ecr.ca-central-1.amazonaws.com/${environment}-${appName}:${dockerVersionTag}
    """
    if (isBranch(mainBranch)) {
      sh """
        docker tag ${aws_account_id}.dkr.ecr.ca-central-1.amazonaws.com/${environment}-${appName}:latest \
          ${aws_account_id}.dkr.ecr.ca-central-1.amazonaws.com/test-${appName}:latest-master
        docker push ${aws_account_id}.dkr.ecr.ca-central-1.amazonaws.com/test-${appName}:latest-master
      """
    }
  }
}

def parallelBuildDockerImage(Deployment pipeline) {
  String dockerVersionTag = pipeline.gitCommitNumber()
  def serviceName = [:]
  services.each { service ->
    def newServiceName = service
    if (!service.getValue()) {
      return
    }
    serviceName[newServiceName.getKey()] = {
      buildDockerImage(newServiceName.getKey(), newServiceName.getValue(), dockerVersionTag)
    }
  }
  return serviceName
}

def deployApp(String appName, Deployment pipeline) {
  withCredentials([string(credentialsId: 'aws_account_id', variable: 'aws_account_id')]) {
    String dockerVersionTag = pipeline.gitCommitNumber()
    sh """
      aws ecs describe-task-definition --task-definition ${environment}-${appName} | jq .taskDefinition | jq "del(.taskDefinitionArn,.requiresAttributes,.revision, .status, .requiresAttributes, .compatibilities)" > ${environment}-${appName}.json
      sed -i -e 's;.*dkr.ecr.ca-central-1.amazonaws.com.*;\"image\": \"${aws_account_id}.dkr.ecr.ca-central-1.amazonaws.com/${environment}-${appName}:${dockerVersionTag}\",;g' ${environment}-${appName}.json
      newRevision=`aws ecs register-task-definition --cli-input-json file://${environment}-${appName}.json | jq .taskDefinition.revision`
      aws ecs update-service --cluster ${ecsClusterName} --service ${environment}-${appName} --task-definition ${environment}-${appName}:\$newRevision --force-new-deployment
    """
    pipeline.checkDeployment(appName, ecsClusterName)
  }
}

def parallelDeployApp(Deployment pipeline) {
  def serviceName = [:]
  services.keySet().each { service ->
    def newServiceName = service
    serviceName[newServiceName] = {
      deployApp(newServiceName, pipeline)
    }
  }
  return serviceName
}

node(jenkinsNodeExecutor) {
  try {
    if (isPullRequest()) {
      setVars()
      pipeline.clearWorkspace()
      pipeline.checkout()
      throttle(['noConcurrentJobs']) {
        node(jenkinsNodeExecutor) {
          checkout scm
          pipeline.deployEnvironment()
          deleteDir()
        }
      }
      stage('Build Docker Images') {
        parallel parallelBuildDockerImage(pipeline)
      }
      pipeline.runMigrationsOrSeed(migrationTaskDefinitionName, ecsClusterName)
      pipeline.runMigrationsOrSeed(seedTaskDefinitionName, ecsClusterName)
      stage('Application Deployments') {
        parallel parallelDeployApp(pipeline)
      }
    }
    currentBuild.result = "SUCCESS"
  } catch (Exception err) {
    println(err)
    currentBuild.result = "FAILURE"
  }
  finally {
    if (isValidBranch(mainBranch)) {
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
      deleteDir()
    }
  }
}