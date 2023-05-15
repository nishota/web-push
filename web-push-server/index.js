import express from 'express';
import cors from 'cors';
import webpush from 'web-push';

const app = express();

// CORS設定
app.use(cors());

// JSONパーサー
app.use(express.json());

// VAPID keys生成
const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscription;

// モックのためのエンドポイント
// セキュリティは別途検討が必要
app.get('/vapidPublicKey', (req, res) => {
    console.log("---public---");
    console.log(vapidKeys.publicKey);
    res.status(200).send(vapidKeys.publicKey);
});

// サブスクリプションを受け取るエンドポイント
app.post('/subscribe', (req, res) => {
  subscription = req.body;

  // ここでsubscriptionをデータベースやメモリ内に保存します。
  // 保存した情報を元に任意のタイミングでプッシュ通知をするように実装する。

  // プッシュ通知を送信
  webpush.sendNotification(subscription, 'Your Push Payload Text')
    .then(() => res.status(201).json({}))
    .catch(console.error);
});

setInterval(function() {
    webpush.sendNotification(subscription, 'Background Push Payload Text')
    .catch(console.error);
}, 10000); // 10000ミリ秒ごとにメソッドを実行

// サーバー起動
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));