const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const config = require('config');  // just need config...

// @desc Register User
router.post('/', 
[ // validation middleware
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;

    try {
      let user = await User.findOne({email});  
      // forget await || {} object || why this works using User?
      if (user) {
        return res.status(400).json({errors: {msg: ['user already exist']}});
      }

      const avatar = gravatar.url(email, {
        size:'200',
        rating:'pg',
        default:'mm'
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // use jwt to token user
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: 360000},
        (err, token) => {
          if (err) throw err;
          res.json({token});  // forget {}
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error")
    }
    // res.send('User Route');
});


// don't forget this
module.exports = router;