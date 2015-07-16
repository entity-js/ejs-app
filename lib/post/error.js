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
 * Listen out for errors during routing.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 *
 * @module ejs
 * @submodule App
 */

var http = require('http'),
    escapeHtml = require('escape-html'),
    t = require('ejs-t');

module.exports = function (next, err, context) {
  'use strict';

  if (err) {
    if (err.statusCode) {
      context.status = err.statusCode;
    }

    if (err.status) {
      context.status = err.status;
    }

    if (!context.status || context.status < 400) {
      context.status = 500;
    }

    context.body = escapeHtml(
      context.env === 'production'
        ? http.STATUS_CODES[context.status]
        : err.stack || err.toString()
    ).replace(/\n/g, '<br>');
  } else {
    context.status = 404;
    context.body = t.t('Cannot :method :url', {
      ':method': escapeHtml(context._req.method),
      ':url': escapeHtml(context.url)
    });
  }

  next();
};
