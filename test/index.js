/* eslint-disable no-console */
/* eslint-disable camelcase */

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

  // const list = await n.mylist.getAll();
  //
  // // 新しいマイリスト(1)を取得
  // const id = list.mylistgroup.find((item) => item.name === '新しいマイリスト(1)').id;
  // const items = (await n.mylist.get(id)).mylistitem;
  // const res = await n.video.getFLV(items[0].item_data.video_id);

  // const videoData = await n.video.getVideoData(items[0].item_data.video_id);

  // const search = await n.video.search({
  //   q       : '初音ミク',
  //   targets : 'title',
  //   _sort   : '-viewCounter',
  //   _context: 'nicoapi',
  //   _limit  : 100,
  //   fields  : 'contentId,title,description,tags,categoryTags,viewCounter,mylistCounter,commentCounter,startTime,thumbnailUrl'
  // });
  //
  // const userInfo = await n.user.getInfo();

  // const newMylistId = await n.mylist.create({
  //   name: '私の',
  //   description: '',
  //   public: 0,
  //   default_sort: 0,
  //   icon_id: 0
  // });

  // await n.mylist.addVideo({
  //   group_id: 59065359,
  //   item_type: 0,
  //   item_id: 'sm9',
  //   description: ''
  // });
  //
  // await n.mylist.deleteVideo({
  //   group_id      : 59065359,
  //   'id_list[0][]': 9 // 動画IDではなくitem_id
  // });

  t.pass();
});
