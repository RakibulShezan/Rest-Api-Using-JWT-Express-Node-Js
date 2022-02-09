const pool = require("../../config/database");

module.exports = {
  create: (data, callback) => {
    pool.query(
      `insert into registration(firstName, lastName, gender, email, password, number) 
            values (?,?,?,?,?,?)`,
      [
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.password,
        data.number,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results);
      }
    );
  },
  getUsers: (callback) => {
    pool.query(
      `select firstName, lastName, gender, email, number from registration`,
      [],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getUsersById: (id, callback) => {
    pool.query(
      `select firstName, lastName, gender, email, number from registration where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  updateUserById: (data, callback) => {
    pool.query(
      `update registration set firstName = ?, lastName = ?,gender = ?, email = ?, number = ? where id = ?`,
      [
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.number,
        data.id,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results[0]);
      }
    );
  },
  deleteUser: (data, callback) => {
    pool.query(
      `delete from registration where id = ?`,
      [data.id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }

        return callback(null, results[0]);
      }
    );
  },
};
