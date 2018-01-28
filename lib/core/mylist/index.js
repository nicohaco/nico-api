'use strict';

const request = require('request');
const cheerio = require('cheerio');
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

        const token = res.body.match(/NicoAPI.token = "(.*)";/);

        if (token === null) {
          reject({
            code: 'NOAUTH'
          });
        }
        else {
          resolve(token[1]);
        }
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
      }).catch((e) => reject(e));
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
      }).catch((e) => reject(e));
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
      }).catch((e) => reject(e));
    });
  }

  getUserMylists(id) {
    return new Promise((resolve, reject) => {
      request.get({
        url    : `http://www.nicovideo.jp/user/${id}/mylist`,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        const $ = cheerio.load(res.body);

        const data = $('.articleBody > .outer').toArray().map((el) => {
          const c = $('h4', el);

          const thumbnailUrls = $('.thumbContainer li', el).toArray().map((e) => {
            return $('img', e).attr('src');
          });

          return {
            id: $('a', c).attr('href').split('/')[1],
            num: $('.mylistNum', c).text().match(/… (.+?) 件/)[1],
            title: $('a', c).text(),
            thumbnailUrls
          };
        });

        resolve(data);
      });
    });
  }
}

module.exports = Mylist;
