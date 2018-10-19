class Message {
  constructor() {
  }

  sendMessage(data) {
    try {
      let token = data[1];
      if (!token || token == null || token == undefined) {
        return;
      }
      token = Buffer.from(token, 'base64').toString();
      token = JSON.parse(token);
      return token;
    } catch (err) {
      console.error(err);
    }

  }
}

module.exports = new Message();