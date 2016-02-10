
var init = require('./lib/init')
var endpoint = require('./lib/endpoint')
var url = require('./lib/url')


module.exports = (provider, config) => {
  var aliases = init.aliases(config)

  return {
    endpoint: endpoint(aliases),
    url: url(provider, aliases),
    aliases
  }
}
