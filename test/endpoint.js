'use strict'

var t = require('assert')
var init = require('../lib/init')
var _endpoint = require('../lib/endpoint')


describe('endpoint', () => {
  it('return request options on missing endpoints', () => {
    var provider = {
      domain1: {path1: {__path: {alias: 'alias1'}}}
    }
    var endpoint = _endpoint(init.aliases(provider))
    t.deepEqual(
      endpoint.options('alias1', {b: 2}),
      {b: 2})
  })

  describe('types', () => {
    it('match all', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'alias1'}, '*': {all: {a: 1}}}}
      }
      var endpoint = _endpoint(init.aliases(provider))
      t.deepEqual(
        endpoint.options('alias1', {b: 2}),
        {a: 1, b: 2})
    })
    it('string', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'alias1'}, 'some/path': {all: {a: 1}}}}
      }
      var endpoint = _endpoint(init.aliases(provider))
      t.deepEqual(
        endpoint.options('alias1', {url: 'some/path', b: 2}),
        {url: 'some/path', a: 1, b: 2})
    })
    it('regular expression', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'alias1'},
          'id\/\\d+': {__endpoint: {regex: true}, all: {a: 1}}}}
      }

      var endpoint = _endpoint(init.aliases(provider))
      t.deepEqual(
        endpoint.options('alias1', {url: 'id/1', b: 2}),
        {url: 'id/1', a: 1, b: 2})
    })
  })

  describe('method', () => {
    it('uppercase method + lowercase config', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'alias1'}, '*': {get: {a: 1}}}}
      }
      var endpoint = _endpoint(init.aliases(provider))
      t.deepEqual(
        endpoint.options('alias1', {method: 'GET', b: 2}),
        {method: 'GET', a: 1, b: 2})
    })
    it('lowercase method + uppercase config', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'alias1'}, '*': {GET: {a: 1}}}}
      }
      var endpoint = _endpoint(init.aliases(provider))
      t.deepEqual(
        endpoint.options('alias1', {method: 'get', b: 2}),
        {method: 'get', a: 1, b: 2})
    })
  })

  describe('priority', () => {
    it('options: 1.request -> 2.endpoint', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'alias1'}, '*': {all: {a: 1}}}}
      }
      var endpoint = _endpoint(init.aliases(provider))
      t.deepEqual(
        endpoint.options('alias1', {a: 2}),
        {a: 2})
    })
    it('endpoint: 1.regex -> 2.str -> 3.*', () => {
      var provider = {
        domain1: {
          path1: {__path: {alias: 'alias1'},
            '*': {all: {a: 1}},
            'some/path': {all: {a: 2}},
            'id\/\\d+': {__endpoint: {regex: true}, all: {a: 3}}
          }
        }
      }
      var endpoint = _endpoint(init.aliases(provider))

      t.deepEqual(
        endpoint.options('alias1', {url: 'something/else', b: 2}),
        {url: 'something/else', a: 1, b: 2})

      t.deepEqual(
        endpoint.options('alias1', {url: 'some/path', b: 2}),
        {url: 'some/path', a: 2, b: 2})

      t.deepEqual(
        endpoint.options('alias1', {url: 'id/1', b: 2}),
        {url: 'id/1', a: 3, b: 2})
    })
  })
})
