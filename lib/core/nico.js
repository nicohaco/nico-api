'use strict';

const auth = require('./auth');
const User = require('./user');
const Video = require('./video');
const Mylist = require('./mylist');
const timeline = require('./timeline');

class Core {
  constructor(info = {}) {
    this.mail = info.mail;
    this.cookie = info.cookie || null;
    this.password = info.password;

    if (this.cookie) {
      this.user = new User(this.cookie);
      this.video = new Video(this.cookie);
      this.mylist = new Mylist(this.cookie);
      this.timeline = new Timeline(this.cookie);
    }
  }

  login() {
    return auth.login(this.mail, this.password).then((res) => {
      const cookies = res.headers['set-cookie']
        .filter((item) => item.includes('user_session=user_session_'));

      if (cookies.length >= 1) this.cookie = cookies[0];

      if (!!this.cookie) {
        this.user = new User(this.cookie);
        this.video = new Video(this.cookie);
        this.mylist = new Mylist(this.cookie);
        this.timeline = new Timeline(this.cookie);
      }

      return this.cookie;
    });
  }
}

module.exports = Core;
