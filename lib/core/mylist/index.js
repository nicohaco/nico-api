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

  getToken() {
    return new Promise((resolve, reject) => {
      request.get({
        url    : url.mylist,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        const token = res.body.match(/NicoAPI.token = "(.*)";/)[1];

        if (token === null) reject(new Error('can not get token'));

        resolve(token);
      });
    });
  }

  create(params) {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => { // 一回で大丈夫か検証する
        request.get({
          url: url.create,
          qs : Object.assign({}, params, {
            token
          }),
          headers: {
            cookie: this.cookie
          }
        }, (err, res) => {
          if (err) reject(err);

          const body = JSON.parse(res.body);

          if (body.status === 'ok') {
            resolve({
              id: body.id
            });
          }
          else {
            reject();
          }
        });
      });
    });
  }

  addVideo(params) {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => { // 一回で大丈夫か検証する
        request.get({
          url: url.add,
          qs : Object.assign({}, params, {
            token
          }),
          headers: {
            cookie: this.cookie
          }
        }, (err, res) => {
          if (err) reject(err);

          const body = JSON.parse(res.body);

          if (body.status === 'ok') {
            resolve();
          }
          else {
            reject(body.error);
          }
        });
      });
    });
  }

  deleteVideo(params) {
    return new Promise((resolve, reject) => {
      this.getToken().then((token) => { // 一回で大丈夫か検証する
        request.get({
          url: url.delete,
          qs : Object.assign({}, params, {
            token
          }),
          headers: {
            cookie: this.cookie
          }
        }, (err, res) => {
          if (err) reject(err);

          const body = JSON.parse(res.body);

          if (body.status === 'ok') {
            resolve();
          }
          else {
            reject(body.error);
          }
        });
      });
    });
  }
}

module.exports = Mylist;
