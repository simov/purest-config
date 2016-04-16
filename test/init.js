
var t = require('assert')
var init = require('../lib/init')


describe('init', () => {
  describe('alias', () => {
    it('__domain', () => {
      var provider = {
        domain1: {
          __domain: {subdomain: 'subdomain1', auth: {a: 1}},
          path1: {}
        }
      }
      var config = init.alias(provider, 'domain1', 'path1')
      t.deepEqual(config, {
        domain: 'domain1',
        path: 'path1',
        subdomain: 'subdomain1',
        auth: {a: 1}
      })
    })
    it('__path', () => {
      var provider = {
        domain1: {
          __domain: {subdomain: 'subdomain1', auth: {a: 1}},
          path1: {
            __path: {
              subdomain: 'subdomain2',
              subpath: 'subpath1',
              version: 'v1',
              endpoint: 'endpoint1',
              auth: {b: 2}
            }
          }
        }
      }
      var config = init.alias(provider, 'domain1', 'path1')
      t.deepEqual(config, {
        domain: 'domain1',
        path: 'path1',
        subdomain: 'subdomain2',
        subpath: 'subpath1',
        version: 'v1',
        endpoint: 'endpoint1',
        auth: {b: 2}
      })
    })
  })

  describe('endpoints', () => {
    it('no endpoints', () => {
      var provider = {domain1: {path1: {}}}
      var config = init.endpoints(provider, 'domain1', 'path1')
      t.equal(config, undefined)
    })
    it('all, str, regex', () => {
      var provider = {
        domain1: {
          path1: {
            '*': {get: {a: 1}},
            'some/path': {post: {b: 2}},
            'id\/\\d+': {__endpoint: {regex: true}, all: {c: 3}}
          }
        }
      }
      var config = init.endpoints(provider, 'domain1', 'path1')
      t.deepEqual(config, {
        all: {get: {a: 1}},
        str: {'some/path': {post: {b: 2}}},
        regex: {'id\/\\d+': {__endpoint: {regex: true}, all: {c: 3}}}
      })
    })
  })

  describe('aliases', () => {
    it('throw on missing __path key', () => {
      var provider = {
        domain: {path: {}}
      }
      t.throws(() => {
        init.aliases(provider)
      }, 'Purest: __path key is required!')
    })
    it('throw on missing __path.alias key', () => {
      var provider = {
        domain: {path: {__path: {}}}
      }
      t.throws(() => {
        init.aliases(provider)
      }, 'Purest: __path.alias key is required!')
    })

    it('alias string', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'name1'}}}
      }
      var aliases = init.aliases(provider)
      t.deepEqual(aliases, {
        name1: {domain: 'domain1', path: 'path1'}
      })
    })
    it('alias array', () => {
      var provider = {
        domain1: {path1: {__path: {alias: ['name1', 'name2']}}}
      }
      var aliases = init.aliases(provider)
      t.deepEqual(aliases, {
        name1: {domain: 'domain1', path: 'path1'},
        name2: {domain: 'domain1', path: 'path1'}
      })
    })

    it('__path.version', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'name1', version: 'v1'}}}
      }
      var aliases = init.aliases(provider)
      t.deepEqual(aliases, {
        name1: {domain: 'domain1', path: 'path1', version: 'v1'}
      })
    })

    it('__domain.auth', () => {
      var provider = {
        domain1: {
          __domain: {auth: {a: 1}},
          path1: {__path: {alias: 'name1'}}
        }
      }
      var aliases = init.aliases(provider)
      t.deepEqual(aliases, {
        name1: {domain: 'domain1', path: 'path1', auth: {a: 1}}
      })
    })
    it('__path.auth', () => {
      var provider = {
        domain1: {
          __domain: {auth: {a: 1}},
          path1: {__path: {alias: 'name1', auth: {a: 2}}}
        }
      }
      var aliases = init.aliases(provider)
      t.deepEqual(aliases, {
        name1: {domain: 'domain1', path: 'path1', auth: {a: 2}}
      })
    })
  })
})
