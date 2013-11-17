"use strict";

var cp = require('child_process');


module.exports = function (filePath, uploadDir, cb) {
  try {
    var process = new ffmpeg(filePath);
    process.then(function (video) {

        video
        .setVideoSize('640x?', true, true, '#fff')
        .setAudioCodec('libfaac')
        .setAudioChannels(2)
        .save('/path/to/save/your_movie.avi', function (error, file) {
            if (!error)
                console.log('Video file: ' + file);
        });

    }, function (err) {
        console.log('Error: ' + err);
    });
  } catch (e) {
      console.log(e.code);
      console.log(e.msg);
  }
}
