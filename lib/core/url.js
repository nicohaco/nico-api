'use strict';

const prefix = 'http://www.nicovideo.jp';
const secure = 'https://secure.nicovideo.jp/secure';

const auth = {
  login: `${secure}/login?site=niconico`
};

const video = {
  flv    : 'http://flapi.nicovideo.jp/api/getflv/',
  info   : `${prefix}/watch/`,
  search : 'http://api.search.nicovideo.jp/api/v2/video/contents/search',
  ranking: `${prefix}/ranking`
};

const mylist = {
  add        : `${prefix}/api/mylist/add`,
  list       : `${prefix}/api/mylist/list?group_id=`, // 指定されたID
  delete     : `${prefix}/api/mylist/delete`,
  mylist     : `${prefix}/my/mylist`,
  create     : `${prefix}/api/mylistgroup/add`,
  deflist    : `${prefix}/api/deflist/list`,
  mylistgroup: `${prefix}/api/mylistgroup/list`
};

const user = {
  info: 'http://api.ce.nicovideo.jp/api/v1/user.info'
};

module.exports = {
  auth,
  user,
  video,
  mylist
};
