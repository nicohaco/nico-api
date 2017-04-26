'use strict';

const axios = require('axios');
const url = require('../url').mylist;

class Mylist {
  constructor(cookie) {
    this.cookie = cookie;
  }

  getAll() {
    return axios.get(url.mylistgroup, {
      withCredentials: true,
      headers        : {
        Cookie: this.cookie
      }
    }).then((res) => res.data.mylistgroup);
  }

  get(id) {
    return axios.get(`${url.list}${id}`, {
      withCredentials: true,
      headers        : {
        Cookie: this.cookie
      }
    }).then((res) => res.data.mylistitem);
  }
}

module.exports = Mylist;
