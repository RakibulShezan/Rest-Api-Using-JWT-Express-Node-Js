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

//function to validate  that all the user inputs
const checkUserInputs = (body) => {
  let errors = { flag: false, message: [] };
  typeof body.email === "string" &&
  body.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ? errors.flag
      ? errors.flag
      : (errors.flag = false)
    : ((errors.flag = true), errors.message.push("Invalid email pattern"));
  typeof body.first_name === "string" && body.first_name.trim().length > 0
    ? errors.flag
      ? errors.flag
      : (errors.flag = false)
    : ((errors.flag = true), errors.message.push("Invalid first name"));
  typeof body.last_name === "string" && body.last_name.trim().length > 0
    ? errors.flag
      ? errors.flag
      : (errors.flag = false)
    : ((errors.flag = true), errors.message.push("Invalid last name"));

  typeof body.number === "string" && body.number.trim().length === 11
    ? errors.flag
      ? errors.flag
      : (errors.flag = false)
    : ((errors.flag = true), errors.message.push("Invalid Number"));
  typeof body.password === "string" && body.password.trim().length >= 6
    ? errors.flag
      ? errors.flag
      : (errors.flag = false)
    : ((errors.flag = true),
      errors.message.push("Password must be at least 6 characters"));
  typeof body.gender === "string" &&
  ["male", "female", "other"].indexOf(body.gender.toLowerCase()) > -1
    ? errors.flag
      ? errors.flag
      : (errors.flag = false)
    : ((errors.flag = true), errors.message.push("Invalid Gender"));

  return errors;
};
module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    /*    body.email =
      typeof body.email === "string" &&
      body.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ? body.email.toLowerCase()
        : false;
    body.number =
      typeof body.number === "string" && body.number.trim().length === 11
        ? body.number
        : false;
    body.password =
      typeof body.password === "string" && body.password.trim().length > 0
        ? body.password
        : false;
    body.gender =
      typeof body.gender === "string" &&
      ["male", "female"].indexOf(body.gender) > -1
        ? body.gender
        : false; */
    const errorInput = checkUserInputs(body);
    if (!errorInput.flag) {
      getUserByEmail(body.email, (err, results) => {
        if (results.length > 0) {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          }
          if (results.length > 0) {
            return res.status(400).json({
              success: 0,
              message: "User already exists",
            });
          }
        } else {
          const salt = genSaltSync(10);
          body.password = hashSync(body.password, salt);
          create(body, (err, results) => {
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
        }
      });
    } else {
      return res.status(400).json({
        success: 0,
        message: errorInput.message, //"Invalid input messages"
      });
    }
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
      const result = compareSync(body.password, results[0].password);
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
