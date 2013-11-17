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
    console.log('handler returned, statusCode = ', res.statusCode);
    
    if (typeof cb === 'function') { cb(null);}
  }).on('error', function(e) {
    errors.push('url is not reachable.');
    if (typeof cb === 'function') { cb(errors);}
  });
}


module.exports = function (req, res, next) {
  var link = req.body.link;

  if (link) {
    checkUrl(link.url, function(errors) {
    
      if (errors && errors.length > 0 && typeof cb === 'function') {
        return cb(errors);
      }

      if (!link.title 
         || typeof link.title !== 'string' 
         || link.title === 'text') {
        link.title = link.url;
      }

      link.slug = slugify(link.title);
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


      console.log('saving link ', link);
      dbs.links.insert(link, function (err, dbLink) {
        res.render('share/link', {link: dbLink});
      });
    });
  } else {
    res.render('share/link');
  }
}

