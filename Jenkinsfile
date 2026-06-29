import java.util.concurrent.TimeUnit

def formatTime(millis) {
  String.format("%d minutes, and %d secs",
      TimeUnit.MILLISECONDS.toMinutes(millis),
      TimeUnit.MILLISECONDS.toSeconds(millis) -
      TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(millis))
  )
}

node {
  try {
    def ontheway = [
      [
        text: "Clientforce UI deployment `$currentBuild.displayName` initiated. A shiny new revision is on its way!",
        fallback: 'A shiny new revision is on its way!',
        color: '#1162E7'
      ]
    ]
    slackSend(channel: "#general", attachments: ontheway)

    checkout scm

    stage('Test') {
      docker.image('node:10-alpine').inside {
        sh 'npm install'
        sh 'npm run test'
        sh 'rm -rf node_modules'
      }
    }

    stage('Deploy') {
      withCredentials([
        usernamePassword(
          credentialsId: 'jenkins-aws-secret-creds',
          usernameVariable: 'AWS_ACCESS_KEY',
          passwordVariable: 'AWS_SECRET_KEY'
        )
      ]) {
        step([
          $class: 'AWSCodeDeployPublisher',
          applicationName: 'ClientforceCodeDeployApp',
          // TODO: Fix string interpolation warning
          awsAccessKey: "$AWS_ACCESS_KEY",
          awsSecretKey: "$AWS_SECRET_KEY",
          credentials: 'awsAccessKey',
          deploymentConfig: 'CodeDeployDefault.OneAtATime',
          deploymentGroupAppspec: false,
          deploymentGroupName: 'ClientforceCodeDeployAppGroup',
          excludes: '',
          iamRoleArn: '',
          includes: '**',
          proxyHost: '',
          proxyPort: 0,
          region: 'us-west-2',
          s3bucket: 'clientforce-code-deploy',
          s3prefix: '',
          subdirectory: '',
          versionFileName: '',
          waitForCompletion: true,
        ])
      }
    }
    // This will run only if successful
    def duration = formatTime(currentBuild.duration)
    def succeeded = [
      [
        text: "Clientforce UI deployment `$currentBuild.displayName` succeeded. Deployment took `$duration`. A shiny new revision is now live!",
        fallback: 'A shiny new revision is now live!',
        color: 'good'
      ]
    ]
    slackSend(channel: "#general", attachments: succeeded)

  } catch (e) {
    // This will run only if failed
    def failed = [
      [
        text: "Clientforce UI deployment `$currentBuild.displayName` failed!",
        fallback: 'Deployment failed. Attention needed',
        color: 'danger'
      ]
    ]
    slackSend(channel: "#general", attachments: failed)

    // Since we're catching the exception in order to report on it,
    // we need to re-throw it, to ensure that the build is marked as failed
    throw e
  } finally {
    def currentResult = currentBuild.result ?: 'SUCCESS'
    if (currentResult == 'UNSTABLE') {
      // This will run only if the run was marked as unstable
    }

    def previousResult = currentBuild.previousBuild?.result
    if (previousResult != null && previousResult != currentResult) {
      // This will run only if the state of the Pipeline has changed
      // For example, if the Pipeline was previously failing but is now successful
    }

    // This will always run
  }
}
