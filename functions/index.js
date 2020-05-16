const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors')({ origin: true });
const {
  email: EMAIL,
  refresh_token: REFRESH_TOKEN,
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  redirect_url: REDIRECT_URL
} = functions.config().app;
const OAuth2 = google.auth.OAuth2;

exports.sendMeMail = functions.https.onRequest((req, res) =>
  cors(req, res, async () => {
    try {
      const { email, title, url } = req.body;
      const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
      oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN
      });
      const { token } = await oauth2Client.getAccessToken();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: token
        }
      });

      const mailOptions = {
        from: `MEmail <${EMAIL}>`,
        to: email,
        subject: title,
        text: url
      };

      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) =>
          error ? reject(error) : resolve(info)
        );
      });
      return res.status(200).send('success');
    } catch (error) {
      console.error(error);
      return res.status(500).send('error');
    }
  })
);
