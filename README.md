# jagajaga-notificator

[北大生応援メディアJagaJaga](https://hu-jagajaga.com/)編集部で使われているお問合せ通知Botです

各種媒体を通じて頂いたお問い合わせを編集部Discordへ転送します

- JagaJaga公式Twitter([@JagaJagaHU](https://twitter.com/JagaJagaHU))へのDM
- [お問合せページ](https://hu-jagajaga.com/contact/)記載のメアドへのメール

## Development

以下のような開発方法をお勧めします

- [clasp](https://github.com/google/clasp)を使いローカル環境で開発する
- [Google Apps Script GitHub アシスタント
](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo?hl=ja)を利用する

## Deployment

Google Apps Scriptのスクリプトプロパティ機能を利用して`WEBHOOK_URL_DISCORD`に適切なWebhookを設定する必要があります

## Acknowledgments 

- <https://blog.logical-dice.com/articles/2020/03/10/gas-gmail-slack>
- <https://qiita.com/guchimina/items/9bb040b507d8a6cc59a3>
- <https://github.com/HUITGroup/email-to-discord-notificator>
