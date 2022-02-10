const {
  createUser,
  getAllUser,
  getUserByUserId,
  updateUser,
  deleteUser,
  login,
} = require("./user.controller");
const { checkToken } = require("../../auth/token_validation");
//require router
const router = require("express").Router();

//create router for createUser
router.post("/", checkToken, createUser);

//create router for getAllUser
router.get("/getusers", checkToken, getAllUser);

//create router for getUserByUserId
router.get("/getusers/:id", checkToken, getUserByUserId);

//create router for updateUser
router.patch("/updateuser/", checkToken, updateUser);

//create router for deleteUser
router.post("/deleteuser/", checkToken, deleteUser);

//create login router
router.post("/login", login);

//export router
module.exports = router;
