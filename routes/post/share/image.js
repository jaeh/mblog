"use strict";

var fs = require('fs')
  , http = require('http')
  , https = require('https')
  , async = require('async')
  , path = require('path')
  , rootDir = path.join(__dirname, '..', '..', '..')
  , dbs = require(path.join(rootDir, 'db'))
  , slugify = require(path.join(rootDir, 'lib', 'slugify'))
  , config = require(path.join(rootDir, 'lib', 'config'));

//please dont create pull requests with complex regexes.
//not using regex might be slower and more clumsy in some cases,
//but it leads to code that is a lot easier to read and change. 

var checkUrl = function (image, uploadDir, cb) {
  var errors = []
    , url = image.url
    , handler = url.indexOf('https') === 0 ? https : http
    , filenameArr = url.split('/')
    , filename = filenameArr[filenameArr.length - 1]
    , date = new Date().getTime().toString()
    , fileDirName = path.join(uploadDir, date + '-' + filename)
    , fileLocalName = '/uploads/' + date + '-' + filename
    , writeStream;

  //urls that are no strings should not be possible.
  if (typeof url !== 'string') {
    if (typeof cb === 'function') { return cb('url is not a string');}
  }

  //catch both https and http at once:
  if (url.indexOf('http') === -1) {
    url = 'http://' + url;
  }


  handler.get(url, function(res) {
    if (res.statusCode === 200) {
      
      writeStream = fs.createWriteStream(fileDirName);
      
      res.on('data', function (chunk) {
        writeStream.write(chunk);
      });

      res.on('end', function () {
        if (typeof cb === 'function') { cb(null);}
      });
    }
  }).on('error', function(e) {
    errors.push('url is not reachable.');
    if (typeof cb === 'function') { cb(errors);}
  });
}


module.exports = function (req, res, next) {
  var image = req.body.image;

  config(function (err, conf) {
    var uploadDir = conf.uploadDir;

    dbs.categories.find({}, function (err, categories) {

      if (image) {
        checkUrl(image, uploadDir, function(errors, data) {

          if (errors && errors.length > 0 && typeof cb === 'function') {
            return cb(errors);
          }

          if (!image.title
             || typeof image.title !== 'string' 
             || image.title === 'text') {
            image.title = image.url;
          }


          if (image.desc === 'description') {
            image.desc = undefined;
          }

          if (image.uploader === 'uploader') {
            image.uploader = undefined;
          }

          image.type = 'image';
          image.slug = slugify(image.title);

          if (errors && errors.length > 0) {
            //~ console.log('returning res.render with errors');
            return res.render('share/image', {link: image, errors: errors});
          }

          image.date = new Date().getTime();

          dbs.links.insert(image, function (err, dbImg) {
            res.render('share/image', {link: dbImg, categories: categories});
          });
        });
      } else {
        res.render('share/image', {categories: categories})
      }
    });
  });
}
