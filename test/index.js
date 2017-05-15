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

  await n.login();

  const list = await n.mylist.getAll();

  // 新しいマイリスト(1)を取得
  const id = list.mylistgroup.find((item) => item.name === '新しいマイリスト(1)').id;
  const items = (await n.mylist.get(id)).mylistitem;

  const res = await n.video.getFLV(items[0].item_data.video_id);

  console.log(res);
  t.pass();
});
