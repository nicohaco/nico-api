'use strict';

const request = require('request');
const cheerio = require('cheerio');
const convertKeys = require('convert-keys');
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

        data.mylistgroup = data.mylistgroup.map((item) => {
          const {
            create_time,
            update_time,
            ...rest
          } = item;

          return convertKeys.toCamel({
            ...rest,
            createdTime: item.create_time,
            updatedTime: item.update_time
          });
        });

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

        data.mylistitem = data.mylistitem.map((item) => {
          const {
            create_time,
            update_time,
            ...rest
          } = item;

          return convertKeys.toCamel({
            ...rest,
            createdTime: item.create_time,
            updatedTime: item.update_time
          });
        });
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
          reject('NOAUTH');
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

  getUserMylist(id) {
    return new Promise((resolve, reject) => {
      request.get({
        url    : `http://www.nicovideo.jp/mylist/${id}?rss=2.0`,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        const $ = cheerio.load(res.body, { xmlMode: true });

        const data = $('item').toArray().map((item) => {
          const description = $(item).find('description').text();
          return {
            title: $(item).find('title').text(),
            videoId: $(item).find('link').text().split('/').slice(-1)[0],
            totalTime: description.match(/"nico-info-length">(.*?)<\//)[1],
            postedDate   : description.match(/"nico-info-date">(.*?)<\//)[1],
            thumbnailUrl: description.match(/src="(.*?)"/)[1]
          };
        });

        resolve(data);
      });
    });
  }
}

module.exports = Mylist;
