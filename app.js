const express = require('express');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/send', router);

router.use('/', sendEmail);

function sendEmail(req, res, next) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
  });

  var mailOptions = {
    from: `MEmail <${process.env.EMAIL}>`,
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

app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});
