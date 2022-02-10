const {
  create,
  getUsers,
  getUsersById,
  updateUserById,
  deleteUser,
  getUserByEmail,
} = require("../users/user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    create(req.body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getAllUser: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getUserByUserId: (req, res) => {
    getUsersById(req.params.id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  updateUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    updateUserById(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      } else if (results.affectedRows === 0) {
        return res.status(404).json({
          success: 0,
          message: "Record not found",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "User updated successfully",
      });
    });
  },
  deleteUser: (req, res) => {
    deleteUser(req.body, (err, results) => {
      //console.log(results.affectedRows);
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      } else if (results.affectedRows < 1) {
        return res.status(404).json({
          success: 0,
          message: "Record not found",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "User deleted successfully",
      });
    });
  },
  login: (req, res) => {
    const body = req.body;
    getUserByEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, "shezan", {
          expiresIn: "1h",
        });
        return res.json({
          success: 1,
          message: "Login successful",
          token: jsontoken,
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  },
};
