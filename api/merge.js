const fs = require('fs');
const path = require('path');

// DocumentRoot
const root = path.resolve('./', '');
// mockデータ（json）の格納場所
const mock = root + '/api';
// マージされたデータの場所（json-serverが扱う）
const json = root + '/db.json';


const update = () => {

  // 古いマージデータの削除
  try {
    if (fs.existsSync(json)) {
      fs.unlinkSync(json);
    }
  } catch (error) {
    console.log(error);
  }

  // mockデータのマージ処理
  const api = fs.readdirSync(mock).reduce((api, file) => {

    if (api === undefined) {
      api = {};
    }

    if (path.extname(file) == '.json') {
      const endpoint = path.basename(file, path.extname(file));

      if (api[endpoint] === undefined) {
        api[endpoint] = {};
      }

      api[endpoint] = JSON.parse(fs.readFileSync(mock + "/" + file, 'utf-8'));

      return api;        
    }
  }, {});

  // マージデータの書き込み
  fs.writeFile(mock + '/../db.json', JSON.stringify(api), err => {
    if (err) {
      throw err;
    }
  });

};

// 初回 npm run serve 時
update();

// mockデータをwatchして変更があれば自動で更新
fs.watch(mock, (e, filename) => update());
