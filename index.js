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

'use strict';

var cluster = require('cluster'),
    app = require('./lib');

// Code to run if we're in the master process.
if (cluster.isMaster) {
  process.title = 'ejs-app';

  // Count the machine's CPUs.
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU.
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for dying workers.
  cluster.on('exit', function (worker) {
    console.log('Worker ' + worker.id + ' died.');
    cluster.fork();
  });
} else {
  app.start();
}

module.exports = app;
