const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const { templates } = require("handlebars");
const sendEmail = async (email, subject, payload, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Ready for message");
        console.log(success);
      }
    });

    const source = fs.readFileSync(path.join(__dirname, templates), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        return error;
      } else {
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    return error;
  }
};
module.exports = sendEmail;
