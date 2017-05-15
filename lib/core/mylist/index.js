'use strict';

const request = require('request');
const url = require('../url').mylist;

class Mylist {
  constructor(cookie) {
    this.cookie = cookie;
  }

  getAll() {
    return new Promise((resolve, reject) => {
      request.get({
        url    : url.mylistgroup,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        const data = JSON.parse(res.body);

        if (data.status === 'fail') reject(JSON.parse(res.body));
        resolve(data);
      });
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      request.get({
        url    : `${url.list}${id}`,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        const data = JSON.parse(res.body);

        if (data.status === 'fail') reject(JSON.parse(res.body));
        resolve(data);
      });
    });
  }
}

module.exports = Mylist;
