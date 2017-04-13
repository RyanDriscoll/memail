const express = require('express');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const secret = require('./secret');

app.use(bodyParser.json());
app.use('/send', router);

router.use('/', sendEmail);

function sendEmail(req, res, next) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: secret.email,
        pass: secret.password
    }
  });

  var mailOptions = {
    from: `MeMail <${secret.email}>`,
    to: req.body.email,
    subject: req.body.title,
    text: req.body.url
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({
        status: 'error'
      });
    } else {
      res.json({
        status: 'success'
      });
    }
  });
}

app.use(function (err, req, res, next) {
  console.error(err, err.stack);
  res.status(err.status || 500).send(err);
});

app.listen(8080, function () {
  console.log('Server is listening on port 8080');
});
