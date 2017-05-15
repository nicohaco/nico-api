'use strict';

const request = require('request');
const url = require('../url').auth;

const login = (mail, password) => {
  return new Promise((resolve, reject) => {
    request.post({
      url : url.login,
      form: {
        mail,
        password
      }
    }, (err, res) => {
      if(err) reject(err);

      resolve(res);
    });
  });
};

module.exports = {
  login
};
