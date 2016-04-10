'use strict'

var t = require('assert')
var init = require('../lib/init')
var _auth = require('../lib/auth')


describe('auth', () => {
  describe('find', () => {
    it('return alias auth on missing endpoints', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'alias1', auth: {a: 1}}}}
      }
      var auth = _auth(init.aliases(provider))
      t.deepEqual(
        auth.find('alias1'),
        {a: 1})
    })

    describe('priority', () => {
      it('endpoint: 1.regex -> 2.str -> 3.*', () => {
        var provider = {
          domain1: {
            path1: {__path: {alias: 'alias1'},
              '*': {__endpoint: {auth: {a: 1}}},
              'some/path': {__endpoint: {auth: {a: 2}}},
              'id\/\\d+': {__endpoint: {regex: true, auth: {a: 3}}}
            }
          }
        }
        var auth = _auth(init.aliases(provider))

        t.deepEqual(
          auth.find('alias1', {url: 'something/else'}),
          {a: 1})

        t.deepEqual(
          auth.find('alias1', {url: 'some/path'}),
          {a: 2})

        t.deepEqual(
          auth.find('alias1', {url: 'id/1'}),
          {a: 3})
      })
    })
  })

  describe('replace', () => {
    it('object', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'alias1', auth:
        {auth: {bearer: '[0]'}}
      }}}}
      var auth = _auth(init.aliases(provider))
      var config = auth.find('alias1')
      t.deepEqual(
        auth.replace(config, 'token'),
        {auth: {bearer: 'token'}})
    })
    it('array', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'alias1', auth:
        [
          {auth: {bearer: '[0]'}},
          {oauth: {token: '[0]', secret: '[1]'}}
        ]
      }}}}
      var auth = _auth(init.aliases(provider))
      var config = auth.find('alias1')
      t.deepEqual(
        auth.replace(config, 'token'),
        {auth: {bearer: 'token'}})
      t.deepEqual(
        auth.replace(config, 'token', 'secret'),
        {oauth: {token: 'token', secret: 'secret'}})
    })
  })
})
