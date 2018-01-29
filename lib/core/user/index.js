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

  getMyHistory() {
    return new Promise((resolve, reject) => {
      request.get({
        url    : `http://www.nicovideo.jp/my/history`,
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

        const data = $('#historyList > .outer').toArray().map((item) => {
          const thumb = $('.thumbContainer', item);
          const section = $('.section', item);
          const metadata = $('.metadata', item);

          const [
            watchedDate,
            watchedCount
          ] = $('p.posttime', section).text().split(' 視聴視聴回数');

          return {
            videoId: $('a', thumb).attr('href'),
            thumbnailUrl: $('img', thumb).attr('data-original'),
            totalTime: $('.videoTime', thumb).text(),
            watchedDate,
            watchedCount: watchedCount.replace('回', ''),
            title: $('h5', section).text(),
            viewCount: $('.play', metadata).text().split('再生:')[1].replace(/,/g, ''),
            commentCount: $('.comment', metadata).text().split('コメント:')[1].replace(/,/g, ''),
            mylistCount: $('.mylist > a', metadata).text().replace(/,/g, ''),
            postedDate: $('.posttime', metadata).text()
          }
        });

        resolve(data);
      });
    });
  }
}

module.exports = User;
