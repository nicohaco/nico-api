'use strict';

const cheerio = require('cheerio');
const request = require('request');
const url = require('../url').timeline;

class Timeline {
  constructor(cookie) {
    this.cookie = cookie;
  }

  getMyAllTimeline() {
    return new Promise((resolve, reject) => {
      request.get({
        url    : url.all,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        const data = JSON.parse(res.body);

        if (data.status !== 'ok') reject(data);

        resolve(data);
      });
    });
  }

  getUserTimeline(id) {
    return new Promise((resolve, reject) => {
      request.get({
        url    : `http://www.nicovideo.jp/api/nicorepo/timeline/user/${id}?client_app=pc_profilerepo`,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        const data = JSON.parse(res.body);

        if (data.status !== 'ok') reject(data);

        resolve(data);
      });
    });
  }
}

module.exports = Timeline;
