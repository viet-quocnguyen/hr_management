const connectionString =
  "mongodb+srv://viet:abcd1234@qvnguyen-web322-2e9nt.mongodb.net/test?retryWrites=true&w=majority";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

var userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String
    }
  ]
});

let User;

// Initialize database
module.exports.initialize = function() {
  return new Promise((resolve, reject) => {
    let db = mongoose.createConnection(connectionString, {
      useNewUrlParser: true
    });

    db.on("error", err => {
      reject(err); // reject the promise with the provided error
    });

    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function(userData) {
  return new Promise((resolve, reject) => {
    const { password, password2 } = userData;
    if (password != password2) {
      return reject("Passwords do not match");
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return reject("There was an error encrypting the password");
        }

        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            return reject("There was an error encrypting the password");
          }
          userData.password = hash;
          let newUser = new User(userData);
          newUser.save(err => {
            if (err && err.code === 11000) {
              return reject("User Name already taken");
            } else if (err && err.code !== 11000) {
              return reject(`There was an error creating the user: ${err}`);
            } else {
              return resolve();
            }
          });
        });
      });
    }
  });
};

module.exports.checkUser = function(userData) {
  return new Promise((resolve, reject) => {
    User.find({ userName: userData.userName })
      .exec()
      .then(users => {
        if (users.length === 0) {
          return reject(`Unable to find user: ${userData.userName}`);
        }

        bcrypt.compare(userData.password, users[0].password).then(res => {
          if (res === true) {
            users[0].loginHistory.push({
              dateTime: new Date().toString(),
              userAgent: userData.userAgent
            });

            User.update(
              {
                userName: users[0].userName
              },
              {
                $set: { loginHistory: users[0].loginHistory }
              }
            )
              .exec()
              .then(() => {
                return resolve(users[0]);
              })
              .catch(err => {
                return reject(`There was an error verifying the user: ${err}`);
              });
          } else {
            return reject(`Incorrect Password for user: ${userData.userName}`);
          }
        });
      })
      .catch(() => {
        return reject(`Unable to find user: ${userData.userName}`);
      });
  });
};
