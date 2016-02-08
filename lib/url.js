
module.exports = (instance) => {
  function get (endpoint, options, config) {
    return [
      domain(options, config),
      path(endpoint, options, config)
    ].join('/')
  }

  function domain (options, config) {
    if (config.domain.indexOf('[subdomain]') === -1) {
      return config.domain
    }

    var subdomain =
      options.subdomain || instance.subdomain || config.subdomain || ''

    if (subdomain !== undefined) {
      return config.domain.replace('[subdomain]', subdomain)
    }
  }

  function path (endpoint, options, config) {
    return config.path
      .replace('[subpath]',
        (options.subpath || instance.subpath || config.subpath || ''))
      .replace('[version]',
        (options.version || instance.version || config.version || ''))
      .replace('{endpoint}',
        (endpoint || config.endpoint || ''))
      .replace('[type]',
        (options.type || instance.type || config.type || 'json'))
  }

  return {
    get: get
  }
}
