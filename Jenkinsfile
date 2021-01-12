#!/bin/bash +x

def getEnvName() {
    def branch = scm.branches[0].name
    if (branch == '*/master') {
        return 'prod'
    } else {
        return 'sit'
    }
}

def envName = getEnvName()
def jobName = env.JOB_NAME
def buildNo = env.BUILD_NUMBER

def selectBuild(env) {
    if (env == 'prod') {
        sh '. ./build-prod.sh'
    } else {
        sh '. ./build-sit.sh'
    }
}

def selectDeploy(env) {
    if (env == 'prod') {
        sh '. ./deploy-prod.sh'
    } else {
        sh '. ./deploy-sit.sh'
    }
}

pipeline {
    agent none

    stages {
        stage('Init'){
            agent any
            steps {
                echo 'Init'
                echo '******************************'
            }
        }
        stage('Build images') {
            agent any
            steps {
                echo "Build images ... ${envName}"
                selectBuild(envName)
                echo '******************************'
            }
        }
        stage('Deployment') {
            agent any
            steps {
                echo 'Deployment'
                selectDeploy(envName)
                echo '******************************'
            }
        }
    }
}