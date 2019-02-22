const express = require('express');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const {
  EMAIL,
  REFRESH_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
} = process.env;
const OAuth2 = google.auth.OAuth2;

app.use(bodyParser.json());

app.use('/send', router);

router.use('/', sendEmail);

function sendEmail(req, res, next) {
  const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
  oauth2Client.setCredentials({
    REFRESH_TOKEN,
  });
  oauth2Client.getAccessToken().then(response => {
    const accessToken = response.token;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `MEmail <${EMAIL}>`,
      to: req.body.email,
      subject: req.body.title,
      text: req.body.url,
    };

    transporter.sendMail(mailOptions, (error, response) => {
      error ? console.log(error) : console.log(response);
      transporter.close();
    });
  });
}

app.use(function(err, req, res, next) {
  console.error(err, err.stack);
  res.status(err.status || 500).send(err);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
  console.log(`Server is listening on port ${PORT}`);
});
