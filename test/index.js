/* eslint-disable no-console */
/* eslint-disable camelcase */

import test from 'ava';
import dotenv from 'dotenv';
import N from '../lib';

dotenv.config();

let n;

test.before(async (t) => {
  n = new N({
    mail    : process.env.MAIL,
    password: process.env.PASSWORD
  });

  await n.login();
});

test('should return mylistgroup', async (t) => {
  const list = await n.mylist.getAll();

  t.snapshot(list);
});

test('should return mylist', async (t) => {
  const list = await n.mylist.get(60973231);

  t.snapshot(list);
});

test('should return token', async (t) => {
  const token = await n.mylist.getToken();

  t.truthy(!(token === 'NOAUTH'));
});
