/**
 * 参考
 * https://blog.logical-dice.com/articles/2020/03/10/gas-gmail-slack
 * https://qiita.com/guchimina/items/9bb040b507d8a6cc59a3
 * https://github.com/HUITGroup/email-to-discord-notificator
 */


// confidential
var prop = PropertiesService.getScriptProperties().getProperties();

const WEBHOOK_URL_TWITTER = prop.WEBHOOK_URL_TWITTER;
const WEBHOOK_URL_GMAIL = prop.WEBHOOK_URL_GMAIL;

const main = () => {
  /**
   * 以下の条件を満たすメールは受信された時に星と"twitterdm"タグが付く
   * 1. 送信者がnotify@twitter.comである
   * 2. 件名に「ダイレクトメッセージ」の文字列を含む
   * 
   * 以下の条件を満たすメールは受信された時に星と"contact"タグが付く
   * 1. 宛先がjagajaga.hu+contact@gmail.comである
   * 
   * 以上の処理はGmailのフィルタで行なっている
   */
  // slackに転送後、星を外す
  var searchTarget = 'is:starred {label:twitterdm label:contact}';
  GmailApp
    .search(searchTarget)
    .forEach((thread) => {
      thread.getMessages().forEach((message) => {
        GmailApp.unstarMessage(message);
        send(message);
        Utilities.sleep(2 * 1000);
      })
      thread.refresh();
    });
}


/**
 * TwitterDMかでメールかで処理を分けています
 * それから Slack の webhook に POST しています
 */
const send = (message) => {
  let sendText;
  const formattedDate = Utilities.formatDate(message.getDate(), "Asia/Tokyo", "yyyy-MM-dd HH:mm")
  if (message.getBody()
    .match(/1px;font-size:1px;color:#ffffff;"> [\s\S]*?<d>/g)) {
    // was twitter DM
    const dmBody = message.getBody()
      .match(/1px;font-size:1px;color:#ffffff;"> [\s\S]*?<d>/g)[0]
      .replace('1px;font-size:1px;color:#ffffff;"> ', '')
      .replace('<d>', '').split(": ");
    const dmFrom = message.getFrom()
      .match(/[\s\S]*?\(Twitterより\)/)[0]
      .slice(1, -12);
    sendText = `from ${dmFrom}（${dmBody[0]}）｜${formattedDate}\n${dmBody[1]}`

    const jsonData = {
      "text": sendText,
    };

    const options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(jsonData)
    };

    Logger.log(options)
    UrlFetchApp.fetch(WEBHOOK_URL_TWITTER, options);
    
  } else {
    const messageBody = message.getPlainBody().slice(0, 200)
    sendText = `from ${message.getFrom()}｜${formattedDate}\n【件名】${message.getSubject()}\n【本文】\n${messageBody} ${message.getPlainBody().length > 200 ? "\n\n...(続きあり)" : "\n\n(本文終わり)"}`

    const jsonData = {
    "text": sendText,
    };

    const options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(jsonData)
    };
    
    Logger.log(options)
    UrlFetchApp.fetch(WEBHOOK_URL_GMAIL, options);
  }
}