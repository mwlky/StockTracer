targetScope = 'subscription'

param repoUrl string
param location string
param deploymentToken string
param staticWebAppName string
param functionAppName string
param resourceGroupName string = 'stockTracerRG'

resource stockTracerRG 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: resourceGroupName
  location: location
}

module staticWebApp 'modules/staticwebapp.bicep' = {
  name: 'staticWebAppDeployment'
  scope: stockTracerRG
  params: {
    name: staticWebAppName
    location: location
    repoUrl: repoUrl
    deploymentToken: deploymentToken
  }
}

module functionApp 'modules/function.bicep' = {
  name: 'functionAppDeployment'
  scope: stockTracerRG
  params: {
    name: functionAppName
    location: location
  }
}
