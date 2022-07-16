const JWT = require("jsonwebtoken");
const User = require("../Models/usermodel");
const Token = require("../Models/tokenmodel");
const sendEmail = require("../utils/Emails/sendmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const JWT_SECRET = "mfefkuhio3k2rjkofn2mbikbkwjhnkjfmeedmdssme";
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;
const nodemailer = require("nodemailer");

const signup = async (data) => {
  let user = await User.findOne({ email: data.email });
  if (user) {
    return "Email already exist";
  }
  user = new User(data);
  const token = JWT.sign({ id: user._id }, JWT_SECRET);
  await user.save();
  return (data = {
    userId: user._id,
    email: user.email,
    name: user.name,
    token: token,
  });
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return "user not exist";
  }
  let token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();
  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
  sendEmail(
    user.email,
    "Password Reset Request",
    { name: user.name, link: link },
    "./templates/requestResetPassword.handlebars"
  );
  return link;
};

const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    return "Invalid or expired password reset token";
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    return "Invalid or expired password reset token";
  }
  const hash = await bcrypt.hash(password, Number(bcryptSalt));
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: userId });
  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.name,
    },
    "./template/resetPassword.handlebars"
  );
  await passwordResetToken.deleteOne();
  return true;
};

module.exports = { signup, requestPasswordReset, resetPassword };
