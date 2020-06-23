const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "upload/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({
  storage: storage
});

const userController = require("../controllers/userController");
const advertController = require("../controllers/advertController");
const middleware = require("../middleware/middleware");
//private Info routes
// const privateInfoController = require("../controllers/privateInfoController");

// user routes
router.post("/user/register", userController.register);
router.post("/user/login", userController.login);
router.get("/user/logout", middleware.authenticate, userController.logout);
router.get("/getAllUsers", middleware.authenticate, userController.getAllUsers);
// router.post("/user/changePassword", userController.changePassword);

// advertModel routes
router.post(
  "/createAdvert",
  middleware.authenticate,
  upload.single("item-picture"),
  advertController.createAdvert
);
router.get(
  "/getAllUserAdvertisements/:page/:limit",
  middleware.authenticate,
  advertController.getAllUserAdvertisements
);

router.get(
  "/createRememberItem/:itemId",
  middleware.authenticate,
  advertController.createRememberItem
);

router.get(
  "/getRememberItem/:page/:limit",
  middleware.authenticate,
  advertController.getRememberItem
);

router.get(
  "/getRememberItemNotifications",
  middleware.authenticate,
  advertController.getRememberItemNotifications
);

router.get(
  "/removeAllAdvertisementsPublic",
  advertController.removeAllAdvertisementsPublic
);

router.get(
  "/getAllAdvertisementsPublic/:page/:limit",
  advertController.getAllAdvertisementsPublic
);
// router.post(
//   "/changepicture",
//   middleware.authenticate,
//   upload.single("item-picture"),
//   userController.changePicture
// );

router.get("/getSingleItem/:itemId", advertController.getSingleItem);

// router.get(
//   "/deleteSingleItem/:itemId",
//   middleware.authenticate,
//   toDoController.deleteItem
// );
// router.get(
//   "/toggleItemChecked/:itemId",
//   middleware.authenticate,
//   toDoController.toggleItemChecked
// );
// privateInfo  routes
// router.post("/create", middleware.authenticate, privateInfoController.create);

module.exports = router;
