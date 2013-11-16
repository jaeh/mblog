"use strict";

var fs = require('fs')
  , path = require('path')
  , youtubedl = require('youtube-dl')
  , rootDir = path.join(__dirname, '..', '..', '..')
  , dbs = require(path.join(rootDir, 'db'))
  , slugify = require(path.join(rootDir, 'lib', 'slugify'))
  , config = require(path.join(rootDir, 'lib', 'config'));

//please dont create pull requests with complex regexes.
//not using regex might be slower and more clumsy in some cases,
//but it leads to code that is a lot easier to read and change. 

var checkUrl = function (link, uploadDir, cb) {
  var errors = []
    , url = link.url
    , filenameArr = url.split('/')
    , filename = filenameArr[filenameArr.length - 1]
    , date = new Date().getTime().toString()
    , fileDirName = path.join(uploadDir, date + '-' + filename)
    , writeStream;

  //urls that are no strings should not be possible.
  if (typeof url !== 'string') {
    if (typeof cb === 'function') { return cb('url is not a string');}
  }

  //catch both https and http at once:
  if (url.indexOf('http') === -1) {
    url = 'http://' + url;
  }

  
  var dl = youtubedl.download(url,
    uploadDir,
    // optional arguments passed to youtube-dl
    ['--max-quality=18']);

  // will be called when the download starts
  dl.on('download', function(data) {
    console.log('Download started');
    console.log('filename: ' + data.filename);
    console.log('size: ' + data.size);
  });

  // will be called during download progress of a video
  dl.on('progress', function(data) {
    process.stdout.write(data.eta + ' ' + data.percent + '% at ' + data.speed + '\r');
  });

  // catches any errors
  dl.on('error', function(err) {
    throw err;
  });

  // called when youtube-dl finishes
  dl.on('end', function(data) {
    console.log('\nDownload finished!');
    console.log('ID:', data.id);
    console.log('Filename:', data.filename);
    console.log('Size:', data.size);
    console.log('Time Taken:', data.timeTaken);
    console.log('Time Taken in ms:', + data.timeTakenms);
    console.log('Average Speed:', data.averageSpeed);
    console.log('Average Speed in Bytes:', data.averageSpeedBytes);

    if (data.filename.indexOf('already been downloaded') === -1) {
  
      link.youtubeId = data.id;
      link.filename = data.filename;
      link.size = data.size;
  
      if (typeof cb === 'function') { cb(null, link); }
    } else {
      dbs.links.findOne({youtubeId: data.id}, function (err, link) {
        console.log('video has already been added. link = ', link);
        if (typeof cb === 'function') { cb (null, link); }
      });
    }
  });
}


module.exports = function (req, res, next) {
  var video = req.body.video;

  config(function (err, conf) {
    dbs.categories.find({}, function (err, categories) {
      if (video) {
        checkUrl(video, conf.uploadDir, function(errors, data) {

          if (errors && errors.length > 0 && typeof cb === 'function') {
            throw errors;
          }

          if (!video.title
             || typeof video.title !== 'string' 
             || video.title === 'text') {
            video.title = video.url;
          }

          video.slug = slugify(video.title);

          if (video.desc === 'description') {
            video.desc = undefined;
          }

          if (video.uploader === 'uploader') {
            video.uploader = undefined;
          }

          video.date = new Date().getTime();
          video.type = 'video';

          if (errors && errors.length > 0) {
            //~ console.log('returning res.render with errors');
            return res.render('share/video', {link: video, errors: errors});
          }


          dbs.links.insert(video, function (err, dbVideo) {
            res.render('share/video', {link: dbVideo, categories: categories});
          });
        });
      } else {
        res.render('share/video', {categories: categories})
      }
    });
  });
}
