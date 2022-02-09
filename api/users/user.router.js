const {
  createUser,
  getAllUser,
  getUserByUserId,
  updateUser,
  deleteUser,
} = require("./user.controller");
//require router
const router = require("express").Router();

//create router for createUser
router.post("/", createUser);

//create router for getAllUser
router.get("/getusers", getAllUser);

//create router for getUserByUserId
router.get("/getuser/:id", getUserByUserId);

//create router for updateUser
router.post("/updateuser/", updateUser);

//create router for deleteUser
router.post("/deleteuser/", deleteUser);

//export router
module.exports = router;
