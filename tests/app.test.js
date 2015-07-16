/**
 *  ______   __   __   ______  __   ______  __  __
 * /\  ___\ /\ "-.\ \ /\__  _\/\ \ /\__  _\/\ \_\ \
 * \ \  __\ \ \ \-.  \\/_/\ \/\ \ \\/_/\ \/\ \____ \
 *  \ \_____\\ \_\\"\_\  \ \_\ \ \_\  \ \_\ \/\_____\
 *   \/_____/ \/_/ \/_/   \/_/  \/_/   \/_/  \/_____/
 *                                         __   ______
 *                                        /\ \ /\  ___\
 *                                       _\_\ \\ \___  \
 *                                      /\_____\\/\_____\
 *                                      \/_____/ \/_____/
 */

var test = require('unit.js');

var app;

describe('ejs/app', function () {

  'use strict';

  /*eslint max-statements:0*/
  /*jshint maxstatements:false*/

  beforeEach(function () {

    app = require('../lib');

  });

  afterEach(function () {

    delete require.cache[require.resolve('../lib')];

    global._ejsStatic['ejs-app'] = {
      _providers: {},
      _servers: {},
      _routing: {
        _all: {}
      }
    };

  });

  describe('App.start()', function () {});

  describe('App.restart()', function () {});

  describe('App.pre()', function () {

    it('shouldAddPreHookToAllServers', function () {});

    it('shouldAddPreHookToSpecifiedServer', function () {});

  });

  describe('App.post()', function () {

    it('shouldAddPostHookToAllServers', function () {});

    it('shouldAddPostHookToSpecifiedServer', function () {});

  });

  describe('App.route()', function () {

    it('shouldAddRouteHookToAllServers', function () {});

    it('shouldAddRouteHookToSpecifiedServer', function () {});

  });

});
