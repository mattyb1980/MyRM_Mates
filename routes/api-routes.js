// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    console.log(req.body);
    if (req.body.personScore == 0) {
      res.json("/survey")
    } else {
      res.json("/members")
    };
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender
    }).then(function() {
      res.redirect(307, "/api/login")
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  app.post("/api/survey", function(req, res) {
    console.log(req.body);
    db.User.update({
      personScore: req.body.personScore,
      city: req.body.city,
      rent: req.body.rent
    }, {
      where: {
        email: req.user.email
      }
    }).then(function() {
      console.log(req.body);
      res.json("/members");
    })
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        name: req.user.name,
        id: req.user.id,
        rent: req.user.rent,
        city: req.user.city,
        personScore: req.user.personScore,
        matchID: req.user.matchID
      });
      console.log(req.user);
    }
  });

  app.post("/api/display", function(req, res) {
    console.log("running display");
    db.User.findOne({
      where: {
        matchID: req.user.matchID,
        id: {
          [Op.ne]: req.user.id
        }
      }
    }).then(function(match) {
      console.log("match", match.name);
      res.json({
        email: match.email,
        name: match.name,
        id: match.id,
        rent: match.rent,
        city: match.city,
        personScore: match.personScore
      });
    });
  });

  app.post("/api/matches", function(req, res) {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    if (req.user.matchID == NaN) {
      console.log("ran matchID vs NaN");
      db.User.findOne({
        where: {
          city: req.user.city,
          rent: req.user.rent,
          matchID: null,
          id: {
            [Op.ne]: req.user.id
          }
        }
      }).then(function(data) {
        console.log("matching");
        //console.log(data);
        console.log(req.user.email);
        console.log(data.email);
        var preSet = getRandomInt();
        db.User.findAll({
          where: {
            matchID: preSet
          }
        }).then(function(purple) {
          if (!purple == null) {
            getRandomInt();
          };
          var setRand = preSet;
          console.log(preSet);
          db.User.update({
            matchID: setRand
          }, {
            where: {
              email: req.user.email
            }
          });
          db.User.update({
            matchID: setRand
          }, {
            where: {
              email: data.email
            }
          });
          console.log("Matched!");
        }).done(function(data) {
          res.json({
            name: data.name,
            email: data.email,
            matchID: data.matchID,
            age: data.age,
            gender: data.gender
          })
          console.log(data.name);
        });
      })

      function getRandomInt() {
        var min = Math.ceil(1);
        var max = Math.floor(500);
        return Math.floor(Math.random() * (max - min)) + min;
      };
    } else {
      db.User.findOne({
        where: {
          matchID: req.user.matchID,
          id: {
            [Op.ne]: req.user.id
          }
        },

      }).then(function(data) {
        res.json({
          email: data.email,
          name: data.name,
          id: data.id,
          rent: data.rent,
          city: data.city,
          personScore: data.personScore
        })
      })
    }

  });
};
