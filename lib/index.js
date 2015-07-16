
var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    Router = require('router'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    async = require('async'),
    ejsStatic = require('ejs-static'),
    merge = require('ejs-merge'),
    sortBy = require('ejs-sortby'),
    listener = require('ejs-listener'),
    Context = require('./context');

var _defaultConfig = {
      http: {
        enabled: true,
        port: 8080
      },
      https: {
        enabled: false,
        port: 8181,
        key: 'keys/key.pem',
        cert: 'keys/cert.pem'
      }
    },
    _static = ejsStatic('ejs-app', {
      _config: _defaultConfig,
      _services: {
        http: null,
        https: null,
        socket: null
      },
      _routers: {
        root: Router(),
        api: Router(),
        assets: Router()
      },
      _pre: [],
      _post: []
    }).get(),
    _app;

/**
 * HTTP/S listen callback.
 *
 * @method _listen
 * @private
 * @param {Object} req The HTTP/S request object.
 * @param {Object} res The HTTP/S response object.
 */
function _listen(req, res) {
  'use strict';

  var queue = [],
      context = new Context(req, res);

  res.context = context;

  function pre(cb) {
    return function (next) {
      cb(next, context);
    };
  }

  function post(cb, err) {
    return function (next) {
      cb(next, err, context);
    };
  }

  for (var i = 0, len = _static._pre; i < len; i++) {
    queue.push(pre(_static._pre[i].callback));
  }

  // @todo - do some magic for subdomains - future.
  _static._routers.root(req, res, function (err) {
    var queue = [];
    for (var i = 0, len = _static._post; i < len; i++) {
      queue.push(post(_static._post[i].callback, err));
    }

    async.series(queue, function (err) {
      if (err) {
        listener.emit('app.error', err, context);
      }

      context.finish();
    });
  });
}

_app = module.exports = {
  /**
   * Initializes the app.
   *
   * @method initialize
   * @param {Object} config The config for the servers and app.
   * @return {Object} Returns self.
   * @chainable
   */
  initialize: function (config) {
    'use strict';

    _static._config = merge(config, _defaultConfig);

    _static._http = http.createServer(_listen);

    _static._https = https.createServer({
      key: fs.readFileSync(config.https.key),
      cert: fs.readFileSync(config.https.cert)
    }, _listen);

    _static._socket = require('socket.io')(
      _static._config.https.enabled ?
        _static._services.https :
        _static._services.http
    );

    _static._socket.on('connection', function (socket) {
      socket.on('event', function (data) {});
      socket.on('disconnect', function () {});
    });

    _static._routers.root.use(compression());

    _static._routers.root.use('/api/', _static._routers.api);
    _static._routers.api.use(bodyParser.json());

    _static._routers.root.use('/assets/', _static._routers.assets);
    _static._routers.assets.use(serveStatic('/path/to/assets', {index: false}));

    return _app;
  },
  /**
   * Start the HTTP/S and socket servers.
   *
   * @method start
   * @return {Object} Returns self.
   * @chainable
   */
  start: function () {
    'use strict';

    _static._http.listen(_static._config.http.port);
    if (_static._config.https.enabled) {
      _static._https.listen(_static._config.https.port);
    }

    return _app;
  },
  /**
   * Add a pre hook.
   *
   * @method pre
   * @param {Function} callback The callback method.
   * @param {Integer} [weight=0] The weight to apply to the hook.
   * @return {Object} Returns self.
   * @chainable
   */
  pre: function (callback, weight) {
    'use strict';

    _static._pre.push({
      callback: callback,
      weight: weight || 0
    });

    sortBy(_static._pre, 'weight');
    return this;
  },
  /**
   * Add a post hook.
   *
   * @method post
   * @param {Function} callback The callback method.
   * @param {Integer} [weight=0] The weight to apply to the hook.
   * @return {Object} Returns self.
   * @chainable
   */
  post: function (callback, weight) {
    'use strict';

    _static._post.push({
      callback: callback,
      weight: weight || 0
    });

    sortBy(_static._post, 'weight');
    return this;
  }
};

//_app.pre(require('./post/access'), -9999);
//_app.pre(require('./post/access-log'), -9000);
//_app.pre(require('./post/alias'), -1000);
_app.post(require('./post/error'), 9000);
//_app.post(require('./post/template'), 9999);
