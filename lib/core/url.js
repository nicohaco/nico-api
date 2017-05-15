'use strict';

const prefix = 'http://www.nicovideo.jp';
const secure = 'https://secure.nicovideo.jp/secure';

const auth = {
  login: `${secure}/login?site=niconico`
};

// ニコ動の動画のurl取る方法がよくわからない
const video = {
  flv: 'http://flapi.nicovideo.jp/api/getflv/'
};

const mylist = {
  deflist    : `${prefix}/api/deflist/list`,
  mylistgroup: `${prefix}/api/mylistgroup/list`,
  list       : `${prefix}/api/mylist/list?group_id=` // 指定されたID
};

module.exports = {
  auth,
  video,
  mylist
};
