
var extend = require('extend')


module.exports = (aliases) => {

  function options (alias, options) {
    var config = aliases[alias]
    var endpoints = config.endpoints

    if (!endpoints || (!endpoints.all && !endpoints.str && !endpoints.regex)) {
      return options
    }

    var endpoint = options.url
    var method = options.method

    function _extend (config) {
      if (config.all) {
        extend(true, options, config.all)
      }
      if (config[method]) {
        extend(true, options, config[method])
      }
    }

    // all
    if (endpoints.all) {
      _extend(endpoints.all)
    }

    // string
    if (endpoints.str && endpoints.str[endpoint]) {
      _extend(endpoints.str[endpoint])
    }

    // regex
    if (endpoints.regex) {
      for (var key in endpoints.regex) {
        if (new RegExp(key).test(endpoint)) {
          var config = endpoints.regex[key]
          if (config.all || config[method]) {
            _extend(config)
            break
          }
        }
      }
    }
  }

  function replace (auth, arg1, arg2) {
    if (auth instanceof Array) {
      auth = (arg1 !== undefined && arg2 !== undefined)
        ? auth[1]
        : auth[0]
    }

    var result = {}
    Object.keys(auth).forEach((key) => {
      result[key] = {}
      Object.keys(auth[key]).forEach((sub) => {
        if (auth[key][sub] === '[0]') {
          result[key][sub] = arg1
        }
        else if (auth[key][sub] === '[1]') {
          result[key][sub] = arg2
        }
      })
    })

    return result
  }

  function config (alias, options) {
    var config = aliases[alias]
    var endpoints = config.endpoints

    if (!endpoints || (!endpoints.all && !endpoints.str && !endpoints.regex)) {
      return config.auth
    }

    var auth
    var endpoint = options.url

    // all
    if (endpoints.all) {
      var __endpoint = endpoints.all.__endpoint
      if (__endpoint && __endpoint.auth) {
        auth = __endpoint.auth
      }
    }

    // string
    if (endpoints.str && endpoints.str[endpoint]) {
      var __endpoint = endpoints.str[endpoint].__endpoint
      if (__endpoint && __endpoint.auth) {
        auth = __endpoint.auth
      }
    }

    // regex
    if (endpoints.regex) {
      for (var key in endpoints.regex) {
        if (new RegExp(key).test(endpoint)) {
          var __endpoint = endpoints.regex[key].__endpoint
          if (__endpoint && __endpoint.auth) {
            auth = __endpoint.auth
            break
          }
        }
      }
    }

    return auth
  }

  function auth (alias, options, arg1, arg2) {
    var auth = config(alias, options)

    if (auth) {
      var result = replace(auth, arg1, arg2)
      extend(true, options, result)
    }
  }

  return {options, auth}
}
