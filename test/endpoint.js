
var should = require('should')
var endpoint = require('../lib/endpoint')


describe('options', function () {
  it('all', function () {
    var endpoints = {all: {get:{a:1}}}
      , options = {b:2}
    var result = endpoint.options('endpoint', options, 'get', endpoints)
    should.deepEqual(result, {a:1, b:2})
  })
  it('regex', function () {
    var endpoints = {regex: {'\\d+': {__endpoint:{regex:true}, get:{a:1}}}}
      , options = {b:2}
    var result = endpoint.options('123', options, 'get', endpoints)
    should.deepEqual(result, {a:1, b:2})
  })
  it('str', function () {
    var endpoints = {str: {string:{get:{a:1}}}}
      , options = {b:2}
    var result = endpoint.options('string', options, 'get', endpoints)
    should.deepEqual(result, {a:1, b:2})
  })
})

describe('auth', function () {
  it('all', function () {
    var endpoints = {all: {__endpoint:{auth:'a'}}}
      , auth = endpoint.auth('endpoint', endpoints)
    auth.should.equal('a')
  })
  it('regex', function () {
    var endpoints = {regex: {'\\d+': {__endpoint:{regex:true, auth:'a'}}}}
      , auth = endpoint.auth('123', endpoints)
    auth.should.equal('a')
  })
  it('str', function () {
    var endpoints = {str: {string:{__endpoint:{auth:'a'}}}}
      , auth = endpoint.auth('string', endpoints)
    auth.should.equal('a')
  })
})


var fixture = {
  provider: {
    custom1: {
      __provider: {
        oauth: true
      },
      'https://domain.com': {
        __domain: {
          auth: {qs:{access_token:'[1]'}}
        },
        'api/[version]/{endpoint}.[type]': {
          __path: {
            alias: ['__default'],
            version: 'v3'
          },
          '*': {
            all: {
              headers: {
                'x-li-format': 'json'
              }
            }
          },
          // added dynamically below
          // 'documents': {
          //   get: {
          //     encoding: null
          //   }
          // },
          'files\\/\\d+\\/content': {
            __endpoint: {
              regex: true
            },
            post: {
              multipart: 'file'
            }
          }
        }
      }
    }
  },
  alias: {
    __default: {
      domain: 'https://domain.com',
      path: 'api/[version]/{endpoint}.[type]',
      version: 'v3',
      auth: {qs:{access_token:'[1]'}},
      endpoints: {
        all: {
          'all': {
            headers: {
              'x-li-format': 'json'
            }
          }
        },
        str: {
          'documents': {
            get: {
              encoding: null
            }
          }
        },
        regex: {
          'files\\/\\d+\\/content': {
            __endpoint: {
              regex: true
            },
            post: {
              multipart: 'file'
            }
          }
        }
      }
    }
  }
}

describe('config', function () {
  it('options', function () {
    var endpoints = fixture.alias.__default.endpoints

    should.deepEqual(
      endpoint.options('files', {}, 'get', endpoints),
      {headers:{'x-li-format':'json'}}
    )
    should.deepEqual(
      endpoint.options('documents', {}, 'get', endpoints),
      {headers:{'x-li-format':'json'}, encoding:null }
    )
    should.deepEqual(
      endpoint.options('files/123/content', {}, 'post', endpoints),
      {headers:{'x-li-format':'json'}, multipart:'file'}
    )
    var options = {headers:{'User-Agent':'Grant', 'x-li-format':'xml'}}
    should.deepEqual(
      endpoint.options('files', options, 'get', endpoints),
      {headers:{'x-li-format':'xml', 'User-Agent':'Grant'}}
    )
  })
})
