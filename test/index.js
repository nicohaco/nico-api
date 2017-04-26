/* eslint-disable no-console */

import test from 'ava';
import dotenv from 'dotenv';
import N from '../lib';

dotenv.config();

test('test flow', async (t) => {
  const n = new N({
    mail    : process.env.MAIL,
    password: process.env.PASSWORD
  });

  await n.login().then((res) => {
    console.log(res);
  });
  const list = await n.mylist.getAll();

  // 新しいマイリスト(1)を取得
  const id = list.find((item) => item.name === '新しいマイリスト(1)').id;
  const items = await n.mylist.get(id);
  console.log(items);

  t.pass();
});
