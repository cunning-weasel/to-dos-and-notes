import passport from "passport";
import MagicLinkStrategy from "passport-magic-link";
// import db from 'db/place';
import nodemailer from "nodemailer";

// passport strategy
passport.use(
  new MagicLinkStrategy(
    {
      secret: process.env.SESSION_SECRET,
      userFields: ["email"],
      tokenField: "token",
      verifyUserAfterToken: true,
    },
    function send(user, token) {
      var link = "http://localhost:3000/login/email/verify?token=" + token;
      var msg = {
        to: user.email,
        from: process.env["EMAIL"],
        subject: "Sign in to Todos",
        text:
          "Hello! Click the link below to finish signing in to do-a-weasel.\r\n\r\n" +
          link,
        html:
          '<h3>Hello!</h3><p>Click the link below to finish signing in to do-a-weasel.</p><p><a href="' +
          link +
          '">Sign in</a></p>',
      };
      return sendgrid.send(msg);
    },
    function verify(user) {
      return new Promise(function (resolve, reject) {
        db.get(
          "SELECT * FROM users WHERE email = ?",
          [user.email],
          function (err, row) {
            if (err) {
              return reject(err);
            }
            if (!row) {
              db.run(
                "INSERT INTO users (email, email_verified) VALUES (?, ?)",
                [user.email, 1],
                function (err) {
                  if (err) {
                    return reject(err);
                  }
                  var id = this.lastID;
                  var obj = {
                    id: id,
                    email: user.email,
                  };
                  return resolve(obj);
                }
              );
            } else {
              return resolve(row);
            }
          }
        );
      });
    }
  )
);

// nodemailer sample code
// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object
  // turn on in gmail less secure apps
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your_email@gmail.com",
      pass: "",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"weasel 👻" <weasel@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Click the link below to finish signing in to do-a-weasel</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);

export default router;
