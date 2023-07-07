const jwt = require('jsonwebtoken');
const db = require("../models");
/**
* TODO(developer): Uncomment the following line before running the sample.
*/
const projectId = 'healthy-return-386105';

// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Instantiates a client
const translate = new Translate({ projectId });

module.exports = {
  getUserByToken: async (token) => {
    const decoded = jwt.verify(token, 'sM4rTR3c1P3');
    const user = await db.users.findOne({ where: { id: decoded.id } })

    return user
  },

  quickStart: async (text) => {
    // The target language
    const target = 'ru';

    // Translates some text into Russian
    const [translation] = await translate.translate(text, target);

    return translation
  }
}