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
  const nicohistory = await n.video.getNicohistory(items[0].item_data.video_id);

  // http://api.search.nicovideo.jp/api/v2/video/contents/search?q=%E5%88%9D%E9%9F%B3%E3%83%9F%E3%82%AF&targets=title&fields=contentId,title,description,tags,categoryTags,viewCounter,mylistCounter,commentCounter,startTime,thumbnailUrl&filters%5BviewCounter%5D%5Bgte%5D=1000000&_sort=-viewCounter&_offset=0&_limit=100&_context=apiguide
  const search = await n.video.search({
    q: '初音ミク',
    targets : 'title',
    _sort   : '-viewCounter',
    _context: 'nicoapi',
    _limit: 100,
    fields: 'contentId,title,description,tags,categoryTags,viewCounter,mylistCounter,commentCounter,startTime,thumbnailUrl'
  });

  t.pass();
});
