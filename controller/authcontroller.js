const {
  signup,
  requestPasswordReset,
  resetPassword,
} = require("../services/authservice");
const User = require("../Models/usermodel");

const signUpController = async (req, res, next) => {
  const signupService = await signup(req.body);
  return res.json(signupService);

  next();
};

const resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email
  );
  return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res, next) => {
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password
  );
  return res.json(resetPasswordService);
};

// const authUser = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email: req.body.email });

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } else if (!user) {
//     return res.status(401).send({
//       msg:
//         "The email address " +
//         req.body.email +
//         " is not associated with any account. please check and try again!",
//     });
//   } else if (!Bcrypt.compareSync(req.body.password, user.password)) {
//     return res.status(401).send({ msg: "Wrong Password!" });
//   } else {
//     res.status(400);
//     throw new Error("Invalid Email or Password");
//   }
// };

module.exports = {
  signUpController,
  resetPasswordRequestController,
  resetPasswordController,
};
