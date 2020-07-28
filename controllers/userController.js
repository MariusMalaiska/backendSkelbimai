const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { secretPassword } = require("../config/config");

register = async (req, res) => {
  let data = req.body;
  let user = new UserModel();

  user.nickName = data.nickName;
  user.email = data.email;
  user.password = data.password;
  // user.phonenumber = data.phonenumber;

  try {
    let createdUser = await user.save();
    res.json(createdUser);
  } catch (e) {
    res.status(400).json(e);
  }
};

getAllUsers = async (req, res) => {
  try {
    let allUsers = await UserModel.find().populate("privateInfo");
    res.json(allUsers);
  } catch (e) {
    res.status(400).json(e);
  }
};

login = async (req, res) => {
  let data = req.body;
  try {
    let user = await UserModel.findOne({
      email: data.email
    });
    if (!user) return res.status(400).json("No such user");
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) return res.status(400).json("Wrong password");

    let role = "userRole";
    let token = jwt.sign(
      {
        id: user._id
      },
      secretPassword
    );

    user.tokens.push({
      token: token,
      role: role
    });
    user.save();

    res.header("x-auth-node", token).json(user);
  } catch (e) {
    res.status(400).json(e);
  }
};

// changePassword = async (req, res) => {
//   let data = req.body;
//   try {
//     let user = await UserModel.findOne({
//       email: data.email
//     });
//     if (!user) return res.status(400).json("No such user");
//     const match = await bcrypt.compare(data.oldPassword, user.password);
//     if (!match) return res.status(400).json("Wrong old password");
//     if (data.newPassword != data.newPasswordRepeat)
//       return res.status(400).json("Passwords do not match");
//     user.password = data.newPassword;
//     await user.save();
//     res.json("password changed");
//   } catch (e) {
//     res.status(400).json(e);
//   }
// };

// getAnotherUserInfo= async (req, res) => {
//   let itemId = req.params.itemId;
//   try {
//     let user = await usertModel.findOne({
//       _id: itemId
//       // user: req.user._id
//     });
//     res.json(item);
//   } catch (e) {
//     res.status(400).json(e);
//   }
// };

logout = async (req, res) => {
  let user = req.user;
  let token = req.token;
  await user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  });
  res.json("successfully signed out");
};

// changePicture = async (req, res) => {
//   console.log(req.file);
//   let user = req.user;
//   user.profilePicture = `http://localhost:3000/${req.file.path}`;
//   let savedUser = await user.save();
//   res.json(savedUser);
// };
// getUserAndItsItems = (req, res) => {};

module.exports = {
  register,
  getAllUsers,
  login,
  //   changePassword,
  logout
  //   changePicture,
  //   getUserAndItsItems
};
