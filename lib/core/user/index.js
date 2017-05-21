'use strict';

const request = require('request');
const url = require('../url').user;

class User {
  constructor(cookie) {
    this.cookie = cookie;
  }

  getInfo() {
    return new Promise((resolve, reject) => {
      request.get({
        url    : 'https://public.api.nicovideo.jp/v1/user.json',
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        const { data } = JSON.parse(res.body);

        if (data && data.userId) {
          request.get({
            url: `${url.info}?user_id=${data.userId}&__format=json`
          }, (err, res) => {
            const user = JSON.parse(res.body).nicovideo_user_response.user;

            const info = Object.assign({
              id         : data.userId,
              area       : data.area,
              name       : user.nickname,
              description: data.description
            }, {
              thumbnailUrl: user.thumbnail_url
            });

            resolve(info);
          });
        }
      });
    });
  }
}

module.exports = User;
