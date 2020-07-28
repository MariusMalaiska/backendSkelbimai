// const UserModel = require('../models/userModel')
const advertModel = require("../models/advertModel");

createAdvert = async (req, res) => {
  let data = req.body;

  // changePicture = async (req, res) => {
  //   console.log(req.file);
  //   let user = req.user;
  //   user.picture = `http://localhost:3000/${req.file.path}`;
  //   let savedUser = await user.save();
  //   res.json(savedUser);
  // };

  try {
    let user = req.user;
    let advertItem = new advertModel();
    advertItem.title = data.title;
    advertItem.category = data.category;
    advertItem.about = data.about;
    advertItem.sell = data.sell;
    advertItem.buy = data.buy;
    advertItem.price = data.price;
    advertItem.city = data.city;
    advertItem.condition = data.condition;
    advertItem.itemPicture = `http://localhost:3002/${req.file.path}`;
    // advertItem.itemPicture = data.itemPicture;
    // ------
    advertItem.user = user._id;
    // advertItem.userName = user.nickName;
    // advertItem.userphone = user.phonenumber;
    // advertItem.useremail = user.email;
    let createdadvertItem = await advertItem.save();
    res.json(createdadvertItem);
  } catch (e) {
    res.status(400).json(e);
    console.log(e);
  }
};

getAllUserAdvertisements = async (req, res) => {
  let page = Number(req.params.page);
  let limit = Number(req.params.limit);

  let skip = (page - 1) * limit;

  let userId = req.user._id;
  try {
    let items = await advertModel
      .find({
        user: userId
      })
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1
      })
      .populate("user");
    let count = await advertModel.count({
      user: userId
    });
    let response = {
      items,
      count
    };

    res.json(response);
  } catch (e) {
    res.status(400).json(e);
  }
};

getAllAdvertisementsPublic = async (req, res) => {
  let page = Number(req.params.page);
  let limit = Number(req.params.limit);
  let skip = (page - 1) * limit;

  try {
    let items = await advertModel
      .find()
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1
      })
      .populate("user");
    let count = await advertModel.count();
    let response = {
      items,
      count
    };
    res.json(response);
  } catch {
    res.status(400).json(e);
  }
};

removeAllAdvertisementsPublic = async (req, res) => {
  try {
    let items = await advertModel.remove();
    let response = {
      items
    };
    res.json(response);
  } catch {
    res.status(400).json(e);
  }
};

getMyAdverts = async (req, res) => {
  let itemId = req.params.itemId;

  try {
    let item = await advertModel.findOne({
      _id: itemId,
      user: req.user._id
    });
    res.json(item);
  } catch (e) {
    res.status(400).json(e);
  }
};

getSingleItem = async (req, res) => {
  let itemId = req.params.itemId;
  try {
    let item = await advertModel.findOne({
      _id: itemId
      // user: req.user._id
    });
    res.json(item);
  } catch (e) {
    res.status(400).json(e);
  }
};
// -----------------------------
// createRememberItem = async (req, res) => {
//   let itemId = req.params.itemId;

//   let userId = req.user._id;
//   try {
//     let item = await advertModel.findOne({
//       _id: itemId
//     });
//     item.userLikes.push(userId);
//     await item.save();
//     res.json(item);
//   } catch (e) {
//     res.status(400).json(e);
//   }
// };
createRememberItem = async (req, res) => {
  let itemId = req.params.itemId;

  let userId = req.user._id;
  try {
    let item = await advertModel.findOne(
      { _id: itemId },
      { userLikes: { $elemMatch: { $eq: userId } } }
    );
    // .elemMatch("userLikes", { $eq: userId })

    // let index = item.userLikes.indexOf(x => x == userId);
    // console.log(item);
    if (item.userLikes.length == 0) {
      item = await item.updateOne({ $push: { userLikes: userId } });
    } else {
      item = await item.updateOne({ $pop: { userLikes: 1 } });
    }

    // find.userLikes = userId

    // console.log(item);

    // await item.save();
    res.json(item);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

getRememberItemNotifications = async (req, res) => {
  let userId = req.user._id;
  try {
    let items = await advertModel
      .find({ userLikes: userId })
      .sort({
        createdAt: -1
      })
      .populate("user");

    // let count = await advertModel.count({ userLikes: userId });
    let rememberItemId = [];
    items.forEach(element => rememberItemId.push(element._id));

    // console.log(response);
    let response = {
      rememberItemId
    };
    console.log(response);
    res.json(response);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

getRememberItem = async (req, res) => {
  let page = Number(req.params.page);
  let limit = Number(req.params.limit);
  // console.log("items.likedItems");
  let skip = (page - 1) * limit;

  let userId = req.user._id;
  try {
    let items = await advertModel
      .find({ userLikes: userId })
      .limit(limit)
      .skip(skip)
      .sort({
        createdAt: -1
      })
      .populate("user");

    let count = await advertModel.count({ userLikes: userId });

    let response = {
      items,
      count
    };
    // console.log(response);
    res.json(response);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

// -----------------------------
deleteItem = async (req, res) => {
  let itemId = req.params.itemId;
  try {
    let response = await advertModel.deleteOne({
      _id: itemId,
      user: req.user._id
    });
    if (response.deletedCount == 0) res.status(400).json("item doesnt exist");
    res.json("item deleted");
  } catch (e) {
    res.status(400).json("item cant be deleted");
  }
};

// toggleItemChecked = async (req, res) => {
//   let itemId = req.params.itemId;
//   try {
//     let item = await advertModel.findOne({
//       _id: itemId,
//       user: req.user._id
//     });
//     item.checked = !item.checked;
//     await item.save();
//     res.json(item);
//   } catch (e) {
//     res.status(400).json(e);
//   }
// };

// pakeisti is checked false i true ir is checked true i false

// delete item

module.exports = {
  createAdvert,
  getAllUserAdvertisements,
  getAllAdvertisementsPublic,
  removeAllAdvertisementsPublic,
  getSingleItem,
  createRememberItem,
  getRememberItem,
  getRememberItemNotifications
  //   deleteItem,
  //   toggleItemChecked
};
