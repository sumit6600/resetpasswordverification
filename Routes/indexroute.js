const {
  signUpController,
  resetPasswordRequestController,
  resetPasswordController,
} = require("../controller/authcontroller");

const router = require("express").Router();

router.post("/auth/signup", signUpController);
router.post("/auth/forgotPassword", resetPasswordRequestController);
router.post("/auth/resetPassword", resetPasswordController);

module.exports = router;
