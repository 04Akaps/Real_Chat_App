const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);

router.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ statusCode: res.statusCode, errMessage: err.errMessage });
});

module.exports = router;
