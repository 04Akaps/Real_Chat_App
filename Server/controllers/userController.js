const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { userLogger } = require("../logs/winston");

module.exports.login = async (req, res, next) => {
  // 로그인을 처리하는 controller
  // 이미 있는 유저 인지를 확인하고, 이후 유저의 데이터에서 password만을 제거해서 return
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // compare는 비밀번호를 검증하는 코드
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;

    userLogger.info(`User Logined!! : ${username}`);
    return res.json({ status: true, user });
  } catch (ex) {
    userLogger.error(`User Login Error : ${ex.message}`);
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  // 새 User를 회원가입 시키는 controller
  // 마찬가지로 생성하고, 생성된 user의 password는 제거한뒤에 return
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    // 비밀번호를 hash 하는 코드
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    userLogger.info(`User Registed!! : ${username}`);
    return res.json({ status: true, user });
  } catch (ex) {
    userLogger.error(`User Register Error : ${ex.message}`);
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  // 모든 User를 가져온다.
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    userLogger.error(`User GetAllUsers Error : ${ex.message}`);
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  // 아바타를 선택할 시에 아바타를 골라주는 controller
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    userLogger.info(`User setAvatar!! : ${userId}, ${avatarImage}`);
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    userLogger.error(`User SetAvatar Error : ${ex.message}`);
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  // 로그아웃
  // onlineUsers는 global로 선언되어 있기 떄문에 delete 해준다.
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    userLogger.info(`User setAvatar!! : ${req.params.id}`);
    return res.status(200).send();
  } catch (ex) {
    userLogger.error(`User LogOut Error : ${ex.message}`);
    next(ex);
  }
};
