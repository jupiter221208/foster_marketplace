// this needs to be a js file to allow importing into next.config.js

const actionsJson = {
  rules: [
    {
      pathPattern: '/*/merch/*',
      apiPath: '/api/blinks/*/merch/*',
    },
  ],
}

/**
 * @param {string} - server base url to use for actions `apiPath`
 */
function generateActionsJson(server) {
  return {
    ...actionsJson,
    rules: actionsJson.rules.map(({ pathPattern, apiPath }) => ({
      pathPattern,
      apiPath: server ? new URL(apiPath, server).toString() : apiPath,
    })),
  }
}

module.exports = {
  actionsJson,
  generateActionsJson,
}
