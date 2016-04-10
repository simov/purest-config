
var extend = require('extend')
var _auth = require('./auth')


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

  function auth (alias, options, arg1, arg2) {
    var config = _auth.find(alias, options)

    if (config) {
      var auth = _auth.replace(config, arg1, arg2)
      extend(true, options, auth)
    }
  }

  return {options, auth}
}
