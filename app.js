"use strict";
/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  , routes = require(path.join(__dirname, 'routes'))
  , dbs = require(path.join(__dirname, 'db'))
  , http = require('http')
  , stylus = require('stylus')
  , config = require('./lib/config')
  , app = express();

// all environments
app.set('port', process.env.PORT || 2323);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon(
  path.join(__dirname, 'public', 'img', 'favicon.ico')
));

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(function (req, res, next) {
  config(function (err, conf) {
    dbs.categories.find({}, function (err, categories) {
      app.set('config', conf);
      app.locals.categories = categories;

      next();
    });
  });
});

app.use(app.router);

app.use(stylus.middleware({
    src: path.join(__dirname, 'public')
}));

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//some routes for get requests:
app.get('/', routes.get.links);

app.get('/share', routes.get.share.index);
app.get('/share/link', routes.get.share.link);
app.get('/share/video', routes.get.share.video);
app.get('/share/image', routes.get.share.image);

app.get('/links', routes.get.links);
app.get('/links/:sort', routes.get.links);
app.get('/:category/links', routes.get.links);
app.get('/link/:date', routes.get.link);

app.get('/config', routes.get.config);

//plus some post requests:
app.post('/share', routes.post.share.index);
app.post('/share/link', routes.post.share.link);
app.post('/share/video', routes.post.share.video);
app.post('/share/image', routes.post.share.image);

app.post('/config', routes.post.config);

//starting the actual server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
