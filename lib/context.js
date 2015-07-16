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

/**
 * Provides the context object.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule App
 */

var unpipe = require('unpipe'),
    onFinished = require('on-finished');

/**
 * The context object constructor.
 *
 * @constructor
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 */
function Context(req, res) {
  'use strict';

  Object.defineProperty(this, '_req', {value: req});
  Object.defineProperty(this, '_res', {value: res});

  this.title = '';
  this.body = '';
  this.output = '';
  this.status = res.statusCode;
  this.url = req.originalUrl || req.url;
  this.env = process.env.NODE_ENV || 'development';

  // @todo - set default headers (powered-by, etc)
}

/**
 * Finish and send the response.
 *
 * @method finish
 * @return {Context} Returns self.
 * @chainable
 */
Context.prototype.finish = function () {
  'use strict';

  var me =this;

  function write() {
    me._res.statusCode = me.status;

    // Security header for content sniffing.
    me._res.setHeader('X-Content-Type-Options', 'nosniff');

    // Standard headers.
    me._res.setHeader('Content-Type', 'text/html; charset=utf-8');
    me._res.setHeader('Content-Length', Buffer.byteLength(me.output, 'utf8'));

    if (me._req.method === 'HEAD') {
      return me._res.end();
    }

    me._res.end(me.output, 'utf8');
  }

  if (onFinished.isFinished(this._req)) {
    return write();
  }

  // Unpipe everything from the request.
  unpipe(this._req);

  // Flush the request.
  onFinished(this._req, write);
  this._req.resume();

  return this;
};

module.exports = Context;
