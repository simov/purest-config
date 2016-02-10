
module.exports = (provider, aliases) => {

  function domain (alias, options) {
    var config = aliases[alias]

    var subdomain =
      (options.subdomain || provider.subdomain || config.subdomain)

    return (subdomain !== undefined)
      ? config.domain.replace('[subdomain]', subdomain)
      : config.domain
  }

  function path (alias, options) {
    var config = aliases[alias]
    var path = config.path
    var value

    value = (options.subpath || provider.subpath || config.subpath)
    if (value !== undefined) {
      path = path.replace('[subpath]', value)
    }

    value = (options.version || provider.version || config.version)
    if (value !== undefined) {
      path = path.replace('[version]', value)
    }

    value = (options.type || provider.type || config.type || 'json')
    path = path.replace('[type]', value)

    value = (options.url || config.endpoint || '')
    path = path.replace('{endpoint}', value)

    return path
  }

  return (alias, options) => {
    options.url = [
      domain(alias, options),
      path(alias, options)
    ].join('/')
  }
}
