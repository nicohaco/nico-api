'use strict';

const qs = require('querystring');
const request = require('request');
const url = require('../url').video;

class Video {
  constructor(cookie) {
    this.cookie = cookie;
  }

  getFLV(id) {
    return new Promise((resolve, reject) => {
      request.get({
        url    : `${url.flv}${id}`,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        resolve(qs.parse(res.body).url);
      });
    });
  }
}

module.exports = Video;