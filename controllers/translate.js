const AWS = require("aws-sdk");
require("dotenv").config(); // Load environment variables from .env file

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION,
  apiVersion: "latest",
});

const translate = new AWS.Translate();

async function getTranslatedText(req, res) {
  const { text, targetLang, sourceLang } = req.body;

  if (!text || !targetLang | !sourceLang) {
    return res
      .status(400)
      .json({ error: "Text, source language and target language are required" });
  }

  const params = {
    Text: text,
    SourceLanguageCode: sourceLang,
    TargetLanguageCode: targetLang,
  };

  try {
    const data = await translate.translateText(params).promise();
    res.status(200).json({ response: data });
  } catch (error) {
    console.error("Error translating text:", error);
    res.status(500).json({ error: error });
  }
}

module.exports = {
  getTranslatedText,
};

// async function getTranslatedText(req, res) {
//     const { text, targetLang } = req.body;

//     if (!text || !targetLang) {
//         return res.status(400).json({ error: "Text and target language are required" });
//     }

//     // const options = {
//     //     method: 'POST',
//     //     url: process.env.RAPID_API_URL,
//     //     headers: {
//     //         'x-rapidapi-key': process.env.RAPID_API_KEY,
//     //         'x-rapidapi-host': process.env.RAPID_API_HOST,
//     //         'Content-Type': 'application/json'
//     //     },
//     //     data: {
//     //         q: text,
//     //         source: 'en',
//     //         target: targetLang,
//     //         format: 'text'
//     //     }
//     // };

//     const options = {
//         method: 'POST',
//         url: process.env.RAPID_API_URL,
//         params: {
//           from: 'en',
//           to: targetLang,
//           query: text
//         },
//         headers: {
//           'x-rapidapi-key': process.env.RAPID_API_KEY,
//           'x-rapidapi-host': process.env.RAPID_API_HOST,
//           'Content-Type': 'application/json'
//         },
//         data: {
//           translate: 'rapidapi'
//         }
//       };

//     try {
//         const response = await axios.request(options);

//         res.status(200).json({ "response": response.data });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// }

// Configure AWS SDK
