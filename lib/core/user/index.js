'use strict';

const request = require('request');
const url = require('../url').user;

class User {
  constructor(cookie) {
    this.cookie = cookie;
  }

  getInfo(id) {
    return new Promise((resolve, reject) => {
      request.get({
        url    : `${url.info}?user_id=${id}&__format=json`,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        resolve(JSON.parse(res.body));
      });
    });
  }
}

module.exports = User;
