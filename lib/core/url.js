'use strict';

const prefix = 'http://www.nicovideo.jp';
const secure = 'https://secure.nicovideo.jp/secure';

const auth = {
  login: `${secure}/login?site=niconico`
};

const mylist = {
  deflist    : `${prefix}/api/deflist/list`,
  mylistgroup: `${prefix}/api/mylistgroup/list`,
  list       : `${prefix}/api/mylist/list?group_id=` // 指定されたID
};

module.exports = {
  auth,
  mylist
};
