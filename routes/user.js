const router = require('express').Router();
let User = require('../models/user.model');

const validateRegisterInput = require("../validation/register.js");

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/register').post((req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ username: req.body.username }).then(user => {
    if(user){
      return res.status(400).json({ password : "Username already exists" });
    } else {
      const username = req.body.username;
      const password = req.body.password;
      const highscore = req.body.highscore;

      const newUser = new User({username, password, highscore});

      newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
    }
  })
});
router.route('/login').post((req, res) => {
  User.findOne({ username: req.body.username }).then(user => {
      if(!user){
        return res.status(400).json({success : false, username : "Username not found" });
      } else {
      if(user.password != req.body.password){
        return res.status(400).json({success : false, password : "password does not match" });
      }
      else{
        res.json({success : true, token: user.username});
      }  
    }
  })
});

router.route('/score').post((req, res) => {
  const username = req.body.username;
  const newHighscore = req.body.highscore;

  User.findOneAndUpdate(
    { username: username },
    { highscore: newHighscore },
    { new: true }
  )
  .then(updatedUser => {
    if (!updatedUser) {
      return res.status(400).json({ username: "User not found" });
    }
    res.json({ success: true, newHighscore: updatedUser.highscore });
  })
  .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;