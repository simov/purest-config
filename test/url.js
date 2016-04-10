'use strict'

var t = require('assert')
var init = require('../lib/init')
var _url = require('../lib/url')


describe('url', () => {
  describe('domain', () => {
    it('return domain by default', () => {
      var provider = {
        domain1: {path1: {__path: {alias: 'alias1'}}}
      }
      var url = _url({}, init.aliases(provider))
      t.equal(
        url.domain('alias1', {}),
        'domain1')
    })

    it('subpath priority: 1.request -> 2.ctor -> 3.config', () => {
      var provider = {
        'domain[subdomain]': {path1: {__path: {alias: 'alias1', subdomain: '1'}}}
      }
      var url = _url({}, init.aliases(provider))
      t.equal(url.domain('alias1', {}), 'domain1')

      var url = _url({subdomain: '2'}, init.aliases(provider))
      t.equal(url.domain('alias1', {}), 'domain2')

      t.equal(url.domain('alias1', {subdomain: '3'}), 'domain3')
    })
  })

  describe('path', () => {
    describe('subpath, version, type', () => {
      it('options priority: 1.request -> 2.ctor -> 3.config', () => {
        var provider = {
          'domain1': {
            'path/[subpath]/[version].[type]': {
              __path: {alias: 'alias1', subpath: '1', version: '1', type: '1'}
            }
          }
        }
        var url = _url({}, init.aliases(provider))
        t.equal(url.path('alias1', {}), 'path/1/1.1')

        var url = _url({subpath: '2', version: '2', type: '2'}, init.aliases(provider))
        t.equal(url.path('alias1', {}), 'path/2/2.2')

        t.equal(url.path('alias1', {subpath: '3', version: '3', type: '3'}), 'path/3/3.3')
      })
      it('type defaults to json', () => {
        var provider = {
          'domain1': {'path.[type]': {__path: {alias: 'alias1'}}}
        }
        var url = _url({}, init.aliases(provider))
        t.equal(url.path('alias1', {}), 'path.json')
      })
    })
    describe('endpoint', () => {
      it('options priority: 1.request -> 2.config', () => {
        var provider = {
          'domain1': {
            'path/{endpoint}': {
              __path: {alias: 'alias1', endpoint: '1'}
            }
          }
        }
        var url = _url({}, init.aliases(provider))
        t.equal(url.path('alias1', {}), 'path/1')

        t.equal(url.path('alias1', {url: '2'}), 'path/2')
      })
      it('endpoint defaults to empty string', () => {
        var provider = {
          'domain1': {
            '{endpoint}': {
              __path: {alias: 'alias1'}
            }
          }
        }
        var url = _url({}, init.aliases(provider))
        t.equal(url.path('alias1', {}), '')
      })
    })
  })

  describe('url', () => {
    it('domain/path', () => {
      var provider = {
        'domain1': {'path1': {__path: {alias: 'alias1'}}}
      }
      var url = _url({}, init.aliases(provider))
      t.equal(url('alias1', {}), 'domain1/path1')
    })
  })
})
