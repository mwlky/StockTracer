param name string
param location string
param repoUrl string
param deploymentToken string

resource staticWebApp 'Microsoft.Web/staticSites@2024-11-01' = {
  name: name
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
      repositoryUrl: repoUrl
      branch: 'main'
      buildProperties:{
        appLocation: 'frontend'
        apiLocation: 'backend'
        outputLocation: 'build'
      }
      provider: 'GitHub'
      repositoryToken: deploymentToken
  }
}
