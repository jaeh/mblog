"use strict";

var http = require('http')
  , https = require('https')
  , async = require('async')
  , path = require('path')
  , rootDir = path.join(__dirname, '..', '..', '..')
  , dbs = require(path.join(rootDir, 'db'))
  , slugify = require(path.join(rootDir, 'lib', 'slugify'));

var checkUrl = function (url, cb) {
  var errors = []
    , handler = url.indexOf('https') === 0 ? https : http;

  //urls that are no strings should not be possible.
  if (typeof url !== 'string') {
    if (typeof cb === 'function') { return cb('url is not a string');}
  }

  //catch both https and http at once:
  if (url.indexOf('http') === -1) {
    url = 'http://' + url;
  }

  handler.get(url, function(res) {
    console.log('res = ', res.statusCode);
    if (res.statusCode === 200) {
      if (typeof cb === 'function') { cb(null);}
    }
  }).on('error', function(e) {
    errors.push('url is not reachable.');
    if (typeof cb === 'function') { cb(errors);}
  });
}


module.exports = function (req, res, next) {
  var link = req.body.link;

  dbs.categories.find({}, function (err, categories) {

    if (link) {
      checkUrl(link.url, function(errors) {
      
        if (errors && errors.length > 0 && typeof cb === 'function') {
          return cb(errors);
        }

        if (!link.text 
           || typeof link.text !== 'string' 
           || link.text === 'text') {
          link.text = link.url;
        }

        link.slug = slugify(link.text);
        link.date = new Date().getTime();
        link.type = 'link';

        if (link.desc === 'description') {
          link.desc = undefined;
        }

        if (link.uploader === 'uploader') {
          link.uploader = undefined;
        }


        if (errors && errors.length > 0) {
          //~ console.log('returning res.render with errors');
          return res.render('share/link', {link: link, errors: errors});
        }

        dbs.links.insert(link, function (err, dbLink) {
          res.render('share/link', {link: dbLink, categories: categories});
        });
      });
    } else {
      res.render('share/link', {categories: categories})
    }
  });
}

