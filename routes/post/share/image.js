"use strict";

var fs = require('fs')
  , http = require('http')
  , https = require('https')
  , async = require('async')
  , path = require('path')
  , gm = require('gm')
  , rootDir = path.join(__dirname, '..', '..', '..')
  , dbs = require(path.join(rootDir, 'db'))
  , slugify = require(path.join(rootDir, 'lib', 'slugify'));

var resizeImage = function (fileDirName, cb) {
  console.log('resizeImage fileDirName = ', fileDirName);
  // resize and remove EXIF profile data
  gm(fileDirName)
    .resize(700, 5000)
    .noProfile()
    .write(fileDirName, function (err) {
      if (!err) console.log('done');
      if (typeof cb === 'function') { cb(null);}
    });
}

var downloadImage = function (handler, fileDirName, url, config, cb) {
  var writeStream
    , errors = [];

  if (!config.download.images) {
    if (typeof cb === 'function') { cb(null);}
  }

  //urls that are not strings should not be possible.
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
        if (config.download.imagesConvert) {
          resizeImage(fileDirName, cb);
        } else {
          cb(null);
        }
      });
    }
  }).on('error', function(e) {
    errors.push('url is not reachable. url was:' + url);
    if (typeof cb === 'function') { cb(errors);}
  });
}

module.exports = function (req, res, next) {
  console.log('config = ', req.app.get('config'));
  var image = req.body.image
    , config = req.app.get('config')
    , uploadDir = config.uploads.dir.val
    , errors = []
    , url = image.url
    , handler = url.indexOf('https') === 0 ? https : http
    , filenameArr = url.split('/')
    , filename = filenameArr[filenameArr.length - 1]
    , date = new Date().getTime().toString()
    , fileDirName = path.join(uploadDir, date + '-' + filename)
    , fileLocalName = '/uploads/' + date + '-' + filename;

  if (image) {

    downloadImage(handler, fileDirName, url, config, function(errors) {

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
      image.localUrl = fileLocalName;

      if (errors && errors.length > 0) {
        //~ console.log('returning res.render with errors');
        return res.render('share/image', {link: image, errors: errors});
      }

      image.date = new Date().getTime();

      dbs.links.insert(image, function (err, dbImg) {
        res.render('share/image', {link: dbImg});
      });
    });
  } else {
    res.render('share/image');
  }
}
