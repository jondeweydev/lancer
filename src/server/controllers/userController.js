const UserDB = require("../models/userModel");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = {};

userController.getUsers = (req, res, next) => {
  UserDB.find({}, (err, users) => {
    if (err) {
      return next("Error in userController.getUsers: " + JSON.stringify(err));
    }
    // adds received users to res.locals for further use
    res.locals.users = users;
    console.log("Users received from database");
    return next();
  });
};

// adds single user to res.locals.user
// finds using req.body, changed from req.params.id for authentication
userController.getUser = (req, res, next) => {
  if (!req.body.handle) return next("User handle is required in request body.");
  UserDB.findOne({ handle: req.body.handle }, (err, user) => {
    if (user !== null) {
      res.locals.user = user;
      console.log("user found");
      return next();
    }
    if (err) {
      return next({
        log: "Database Find Error",
        status: 501,
        message: {
          err: "Error in userController.getUser: " + JSON.stringify(err),
        },
      });
    } else {
      return next({
        log: "This handle does not exist.",
        status: 401,
        message: { err: "Error in userController.getUser: " },
      });
    }
  });
};

userController.createUser = (req, res, next) => {
  // checks if unique user handle is already in use
  UserDB.findOne({ handle: req.body.handle }, (findErr, findRes) => {
    if (findErr) {
      return next({
        log: "Database Find Error",
        status: 500,
        message: {
          err: "Error in userController.createUser: " + JSON.stringify(findErr),
        },
      });
    }
    if (findRes === null) {
      if (
        req.body.handle &&
        req.body.password &&
        req.body.firstName &&
        req.body.lastName
      ) {
        let newBio;
        req.body.bio ? (newBio = req.body.bio) : (newBio = "");

        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
          const newUser = {
            handle: req.body.handle,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            bio: newBio,
          };

          UserDB.create(newUser, (dbErr, user) => {
            if (dbErr) {
              return next({
                log: "Database Create Error",
                status: 500,
                message: {
                  err:
                    "Error in userController.createUser: " +
                    JSON.stringify(dbErr),
                },
              });
            }
            console.log(newUser.handle + " has been stored in the database.");
            return next();
          });
        });
      } else
        return next({
          log: "All fields are required to create a new user",
          status: 401,
          message: { err: "Error in userController.createUser" },
        });
    } else
      return next({
        log: "This username is already in use",
        status: 402,
        message: { err: "Error in userController.createUser: " },
      });
  });
};

// updates user with fields from req.body.update (handle, first, last, svc, rate, zip)
userController.updateUser = (req, res, next) => {
  if (!req.body.update)
    return next(
      "At least one field is required in the request body's update property."
    );

  UserDB.findOneAndUpdate(
    { handle: req.params.id },
    req.body.update,
    null,
    (err, user) => {
      if (err)
        return next(
          "Error finding user in userController.User: " + JSON.stringify(err)
        );
      if (!user)
        return next("The handle given in request query does not exist.");

      console.log(req.params.id + " has been updated with the given fields.");
    }
  );

  const findHandle = req.body.update.handle
    ? req.body.update.handle
    : req.params.id;

  UserDB.findOne({ handle: findHandle }, (err, user) => {
    res.locals.user = user;
    return next();
  });
};

userController.deleteUser = (req, res, next) => {
  UserDB.findOne({ handle: req.params.id }, (err, user) => {
    if (err)
      return next(
        "Error finding user in userController.deleteUser: " +
          JSON.stringify(err)
      );
    if (!user) return next("User not found");

    UserDB.deleteOne({ handle: user.handle }, (err, result) => {
      if (err)
        return next(
          "Error deleting user in userController.deleteUser: " +
            JSON.stringify(err)
        );
      console.log(user.handle + " deleted from database");
      return next();
    });
  });
};

userController.login = (req, res, next) => {
  if (!req.body.password) {
    return next("Password is required in the request body.");
  }

  bcrypt.compare(req.body.password, res.locals.user.password, (err, result) => {
    if (result) {
      req.session.authenticated = true;
      req.session.user = res.locals.user;
      console.log(req.session.user);
      console.log("user logged in");
      return next();
    }
    if (err) {
      return next({
        log: "Bcrypt hash comparison error",
        status: 500,
        message: {
          err: "Error in userController.login: " + JSON.stringify(err),
        },
      });
    } else {
      return next({
        log: "Invalid password.",
        status: 402,
        message: { err: "Error in userController.login" },
      });
    }
  });
};

userController.logout = (req, res, next) => {
  // delete req.session.user;
  req.session.authenticated = false;
  req.session.destroy(() => {
    console.log("User logged out.");
    res.clearCookie("userID", { path: "/" });
    res.clearCookie('connect.sid', { path: '/' });
    return next();
  });
};

userController.refreshSession = (req, res, next) => {
  req.session.user = res.locals.user;
  return next();
};

module.exports = userController;
