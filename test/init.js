
var should = require('should')
var init = require('../lib/init')


describe('aliases', function () {
  it('throw on missing __path key', function () {
    var provider = {
      domain: {
        path: {}
      }
    }
    ;(function () {
      var aliases = init.aliases(provider)
    }).should.throw('Purest: __path key is required!')
  })
  it('throw on missing __path.alias key', function () {
    var provider = {
      domain: {
        path: {__path:{}}
      }
    }
    ;(function () {
      var aliases = init.aliases(provider)
    }).should.throw('Purest: __path.alias key is required!')
  })
  it('alias string', function () {
    var provider = {
      domain: {
        path: {__path: {alias:'name'}}
      }
    }
    var aliases = init.aliases(provider)
    should.deepEqual(aliases, {
      name: {
        domain:'domain', path:'path'
      }
    })
  })
  it('alias array', function () {
    var provider = {
      domain: {
        path: {__path: {alias:['name1', 'name2']}}
      }
    }
    var aliases = init.aliases(provider)
    should.deepEqual(aliases, {
      name1: {
        domain:'domain', path:'path'
      },
      name2: {
        domain:'domain', path:'path'
      }
    })
  })
  it('__path.version', function () {
    var provider = {
      domain: {
        path: {__path: {alias:'name', version:'v1'}}
      }
    }
    var aliases = init.aliases(provider)
    should.deepEqual(aliases, {
      name: {
        domain:'domain', path:'path', version:'v1'
      }
    })
  })
  it('__domain.auth', function () {
    var provider = {
      domain: {
        __domain: {auth:{a:1}},
        path: {__path: {alias:'name'}}
      }
    }
    var aliases = init.aliases(provider)
    should.deepEqual(aliases, {
      name: {
        domain:'domain', path:'path', auth:{a:1}
      }
    })
  })
  it('__path.auth', function () {
    var provider = {
      domain: {
        __domain: {auth:{a:1}},
        path: {__path: {alias:'name', auth:{a:2}}}
      }
    }
    var aliases = init.aliases(provider)
    should.deepEqual(aliases, {
      name: {
        domain:'domain', path:'path', auth:{a:2}
      }
    })
  })
})


describe('endpoints', function () {
  it('all', function () {
    var provider = {
      domain: {
        path: {
          '*': {get:{a:1}}
        }
      }
    }
    var result = init.endpoints(provider, 'domain', 'path')
    should.deepEqual(result, {all: {get:{a:1}}})
  })
  it('regex', function () {
    var provider = {
      domain: {
        path: {
          '\\d+': {__endpoint:{regex:true}, get:{a:1}}
        }
      }
    }
    var result = init.endpoints(provider, 'domain', 'path')
    should.deepEqual(result, {
      regex: {'\\d+': {__endpoint:{regex:true}, get:{a:1}}}})
  })
  it('str', function () {
    var provider = {
      domain: {
        path: {
          'string': {get:{a:1}}
        }
      }
    }
    var result = init.endpoints(provider, 'domain', 'path')
    should.deepEqual(result, {str:{string:{get:{a:1}}}})
  })
})
