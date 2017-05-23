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

  getVideoData(id) {
    return new Promise((resolve, reject) => {
      request.get({
        url    : `${url.info}${id}`,
        headers: {
          cookie: this.cookie
        }
      }, (err, res) => {
        if (err) reject(err);

        // for flash page, not html5 page
        const cheerio = require('cheerio');
        const $ = cheerio.load(res.body);

        const title = $('.videoHeaderTitle').text();
        const postedDate = $('.videoPostedAt').eq(0).text();
        const poster = $('.userName').eq(0).text();
        const viewCount = $('.viewCount').text();
        const posterThumbnailUrl = $('.usericon').attr('src');
        const videoThumbnailUrl = $('.videoThumbnailImage').attr('src');
        const commentCount = $('.commentCount').text();
        const mylistCount = $('.mylistCount').text();
        const description = $('.videoDescription').text();

        const tags = $('.videoHeaderTagLink').toArray().map((item) => {
          return {
            href: `http://www.nicovideo.jp${item.attribs.href}`,
            text: item.children[0] ? item.children[0].data : ''
          };
        });

        const obj = {
          title             : title,
          postedDate        : postedDate,
          description       : description,
          poster            : poster,
          posterThumbnailUrl: posterThumbnailUrl,
          videoThumbnailUrl : videoThumbnailUrl,
          commentCount      : commentCount,
          mylistCount       : mylistCount,
          viewCount         : viewCount,
          tags              : tags,
          nicoHistory       : res.headers['set-cookie'][1]
        };

        resolve(obj);
      });
    });
  }

  search(params) {
    const searchUrl = `${url.search}?${qs.stringify(params)}`;

    return new Promise((resolve, reject) => {
      request.get({
        url: searchUrl
      }, (err, res) => {
        if (err) reject(err);

        resolve(JSON.parse(res.body).data);
      });
    });
  }
}

module.exports = Video;
