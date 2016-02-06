'use strict'

var extend = require('extend')

// check for endpoint specific options
exports.options = function (endpoint, options, method, endpoints) {
  var result = {}

  function _extend (config) {
    if (config.all) {
      extend(true, result, config.all, options)
    }
    if (config[method]) {
      extend(true, result, config[method], options)
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

  return Object.keys(result).length ? result : options
}

// check for endpoint specific authentication
exports.auth = function (endpoint, endpoints) {
  if (!endpoints.all && !endpoints.str && !endpoints.regex) {
    return
  }

  var result = null
  if (endpoints.all) {
    var __endpoint = endpoints.all.__endpoint
    if (__endpoint && __endpoint.auth) {
      result = __endpoint.auth
    }
  }
  if (endpoints.str && endpoints.str[endpoint]) {
    var __endpoint = endpoints.str[endpoint].__endpoint
    if (__endpoint && __endpoint.auth) {
      result = __endpoint.auth
    }
  }
  if (endpoints.regex) {
    for (var key in endpoints.regex) {
      if (new RegExp(key).test(endpoint)) {
        var __endpoint = endpoints.regex[key].__endpoint
        if (__endpoint && __endpoint.auth) {
          result = __endpoint.auth
          break
        }
      }
    }
  }

  return result
}
