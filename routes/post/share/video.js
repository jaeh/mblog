"use strict";

var fs = require('fs')
  , path = require('path')
  , youtubedl = require('youtube-dl')
  , rootDir = path.join(__dirname, '..', '..', '..')
  , dbs = require(path.join(rootDir, 'db'))
  , slugify = require(path.join(rootDir, 'lib', 'slugify'));

var checkUrl = function (link, config, cb) {
  var errors = []
    , url = link.url
    , filenameArr = url.split('/')
    , filename = filenameArr[filenameArr.length - 1]
    , date = new Date().getTime().toString()
    , fileDirName = path.join(config.uploads.dir.val, date + '-' + filename)
    , writeStream;

  if (!config.download.video) {
    if (typeof cb === 'function') { cb(null, link); }
  }

  //urls that are no strings should not be possible.
  if (typeof url !== 'string') {
    if (typeof cb === 'function') { return cb('url is not a string');}
  }

  //catch both https and http at once:
  if (url.indexOf('http') === -1) {
    url = 'http://' + url;
  }

  dbs.links.findOne({url: url}, function (err, dbLink) {

    if (dbLink && typeof cb === 'function') { return cb (null, dbLink); }

    var dl = youtubedl.download(
      url,
      conf.uploads.dir,
      // optional arguments passed to youtube-dl
      ['--max-quality=18']
    );

    // will be called when the download starts
    dl.on('download', function (data) {
      console.log('Download started');
      console.log('filename: ' + data.filename);
      console.log('size: ' + data.size);
    });

    // will be called during download progress of a video
    dl.on('progress', function (data) {
      process.stdout.write(data.eta + ' ' + data.percent + '% at ' + data.speed + '\r');
    });

    // catches any errors
    dl.on('error', function (err) {
      throw err;
    });

    // called when youtube-dl finishes
    dl.on('end', function (data) {
      console.log('\nDownload finished!');
      console.log('ID:', data.id);
      console.log('Filename:', data.filename);
      console.log('Size:', data.size);
      console.log('Time Taken:', data.timeTaken);
      console.log('Time Taken in ms:', + data.timeTakenms);
      console.log('Average Speed:', data.averageSpeed);
      console.log('Average Speed in Bytes:', data.averageSpeedBytes);

      link.youtubeId = data.id;
      link.filename = data.filename;
      link.size = data.size;

      if (typeof cb === 'function') { cb(null, link); }
    });
  });
}


module.exports = function (req, res, next) {
  var video = req.body.video
    , config = req.app.get('config');

  if (video) {
    checkUrl(video, config, function(errors, data) {

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
        res.render('share/video', {link: dbVideo});
      });
    });
  } else {
    res.render('share/video')
  }
}
