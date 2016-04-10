'use strict'

var extend = require('extend')
var _auth = require('./auth')


module.exports = (aliases) => {

  function options (alias, options) {
    var config = aliases[alias]
    var endpoints = config.endpoints

    if (!endpoints || (!endpoints.all && !endpoints.str && !endpoints.regex)) {
      return options
    }

    var result = {}

    var endpoint = options.url
    var method = options.method || ''

    function _extend (config) {
      if (config.all) {
        extend(true, result, config.all, options)
      }
      else {
        var obj = config[method.toLowerCase()] || config[method.toUpperCase()]
        if (obj) {
          extend(true, result, obj, options)
        }
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

    return result
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
