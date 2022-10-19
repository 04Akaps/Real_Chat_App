const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

router.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ statusCode: res.statusCode, errMessage: err.errMessage });
});

module.exports = router;
