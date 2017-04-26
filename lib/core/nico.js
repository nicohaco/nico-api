'use strict';

const auth = require('./auth');
const Mylist = require('./mylist');

// [TODO] axiosのインスタンス化を行う

class Core {

  // Login, etc...
  constructor(info = {}) {
    this.mail = info.mail;
    this.password = info.password;

    this.cookie = null;
  }

  login() {
    return auth.login(this.mail, this.password).then((res) => {
      const cookies = res.headers['set-cookie']
        .filter((item) => item.includes('user_session=user_session_'));

      if (cookies.length >= 1) this.cookie = cookies[0];

      if (!!this.cookie) {
        this.mylist = new Mylist(this.cookie);
      }

      return !!this.cookie;
    });
  }
}

module.exports = Core;
