'use strict';

const qs = require('querystring');
const cheerio = require('cheerio');
const request = require('request');
const url = require('../url').video;

const categories = {
  'カテゴリ合算': 'all',

  'エンタメ・音楽'   : 'g_ent2',
  '音楽'        : 'music',
  '東方'        : 'toho',
  'ラジオ'       : 'radio',
  '歌ってみた'     : 'sing',
  'VOCALOID'  : 'vocaloid',
  'アイドルマスター'  : 'imas',
  'ニコニコインディーズ': 'nicoindies',

  '生活・一般・スポ': 'g_life2',
  '動物': 'animal',
  '料理': 'cooking',
  '自然': 'nature',
  '旅行': 'travel',
  'スポーツ': 'sport',
  'ニコニコ動画講座': 'lecture',
  '車載動画': 'drive',
  '歴史': 'history',

  '政治': 'g_politics',

  '科学・技術': 'g_tech',
  '科学': 'science',
  'ニコニコ技術部': 'tech',
  'ニコニコ手芸部': 'handcraft',
  '作ってみた': 'make',

  'アニメ・ゲーム・絵': 'g_culture2',
  'アニメ': 'anime',
  'ゲーム': 'game',
  '実況プレイ動画': 'jikkyo',
  '東方': 'toho',
  'アイドルマスター': 'imas',
  'ラジオ': 'radio',
  '描いてみた': 'draw',

  'その他': 'g_other',
  '例のアレ': 'are',
  '日記': 'diary',
  // 'その他': 'other'
};

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

        if (res.body.trim() === 'closed=1&done=true') {
          reject({
            code: 'NOAUTH' // ?
          });
        }
        if (res.body.trim() === 'error=invalid_v1&done=true') {
          reject({
            code: 'ACCESS_DENIED'
          });
        }

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

        if (res.statusCode === 404) {
          reject({
            code: 'DELETED'
          });
        }

        if (res.statusCode === 503) {
          reject({
            code: 'SERVER_ERROR'
          });
        }

        const nicoHistory = res.headers['set-cookie'][1];

        request.get({ url: `http://ext.nicovideo.jp/api/getthumbinfo/${id}`,
          headers: {
            cookie: this.cookie
          }
        }, (err, res) => {

          if (err) reject(err);

          const $ = cheerio.load(res.body, { xmlMode: true });
          const title = $('title').text();
          const postedDate = $('first_retriev').text();
          const videoThumbnailUrl = $('thumbnail_url').text();
          const poster = $('user_nickname').text();
          const posterThumbnailUrl = $('user_icon_url').text();
          const viewCount = $('view_counter').text();
          const commentCount = $('comment_num').text();
          const mylistCount = $('mylist_counter').text();
          const description = $('description').text();
          const totalTime = $('length').text();
          const tags = $('tag').toArray().map(function() {
            return {
              text: $(this).text()
            };
          })

          // for flash page, not html5 page
          // const $ = cheerio.load(res.body);

          // const title = $('.videoHeaderTitle').text();
          // const postedDate = $('.videoPostedAt').eq(0).text();
          // const poster = $('.userName').eq(0).text();
          // const viewCount = $('.viewCount').eq(0).text();
          // const posterThumbnailUrl = $('.usericon').attr('src');
          // const videoThumbnailUrl = $('.videoThumbnailImage').attr('src');
          // const commentCount = $('.commentCount').eq(0).text();
          // const mylistCount = $('.mylistCount').eq(0).text();
          // const description = $('.videoDescription').text();
          //
          // const tags = $('.videoHeaderTagLink').toArray().map((item) => {
          //   return {
          //     href: `http://www.nicovideo.jp${item.attribs.href}`,
          //     text: item.children[0] ? item.children[0].data : ''
          //   };
          // });

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
            totalTime         : totalTime,
            nicoHistory       : nicoHistory
          };

          if (!obj.nicoHistory) {
            reject({
              code: 'DELETED'
            });
          }

          resolve(obj);
        });
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

  getRanking(category, period = 'daily') {
    const categoryUrl =
      `${url.ranking}${period}/${categories[category]}?rss=2.0&lang=ja-jp`;

    return new Promise((resolve, reject) => {
      request.get({
        url: categoryUrl
      }, (err, res) => {
        if (err) reject(err);

        const $ = cheerio.load(res.body, { xmlMode: true });
        const obj = $('item').toArray().map((item, i) => {
          const link = $(item).find('link').text();
          const description = $(item).find('description').text();

          return {
            rank         : i + 1,
            link         : link,
            title        : $(item).find('title').text().split('：')[1],
            videoId      : link.split('/').slice(-1)[0],
            thumbnailUrl : description.match(/src="(.*?)"/)[1],
            lengthSeconds: description.match(/"nico-info-length">(.*?)<\//)[1]
          };
        });

        resolve(obj);
      });
    });
  }
}

module.exports = Video;
