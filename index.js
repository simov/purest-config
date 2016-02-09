
var init = require('./lib/init')
var endpoint = require('./lib/endpoint')
var url = require('./lib/url')


module.exports = (instance, config, extend) => {

  var aliases = init.aliases(config)

  return {
    endpoint: endpoint(aliases, extend),
    url: url(instance, aliases),
    aliases: aliases
  }
}
