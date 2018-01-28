'use strict';

const request = require('request');
const cheerio = require('cheerio');
const url = require('../url').user;

class User {
  constructor(cookie) {
    this.cookie = cookie;
  }

  getInfo() { // my info
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

  getUserInfo(id) {
    return new Promise((resolve, reject) => {
      request.get({
        url    : `http://www.nicovideo.jp/user/${id}`,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);
        if (res.statusCode === 503) {
          reject({
            code: 'SERVER_ERROR'
          });
        }

        const $ = cheerio.load(res.body);

        const data = {
          name: $('.profile > h2').text().slice(0, -2),
          followers: $('.profile .num').text(),
          thumbnailUrl: $('.avatar > img').attr('src')
        };

        resolve(data);
      });
    });
  }

  getMyFollowing() {
    return new Promise((resolve, reject) => {
      request.get({
        url    : `http://www.nicovideo.jp/my/fav/user`,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        if (res.statusCode === 503) {
          reject({
            code: 'SERVER_ERROR'
          });
        }

        const $ = cheerio.load(res.body);

        const data = $('.articleBody > .outer').toArray().map((item) => {
          const a = $('h5 > a', item);

          return {
            id: a.attr('href').split('/')[2],
            name: a.text(),
            description: $('.section > p', item).text(),
            thumbnailUrl: $('.userIcon', item).attr('src')
          }
        });

        resolve(data);
      });
    });
  }
}

module.exports = User;
