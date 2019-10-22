const express = require('express');
const router = express.Router();  // forget ()

const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route  GET api/auth
// @desc   token authenticate user
// @access private
router.get('/', auth, async (req, res) => { // req header with token
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        // forget req.user?
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

// @route  POST api/auth
// @desc   Login: user credential get token
// @access public
router.post('/', 
[ 
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password').exists()
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {
      let user = await User.findOne({email});  // User represent database
      if (!user) {
        return res.status(400).json({errors: {msg: ['Invalid Credentials']}}); // don't use "no user"
      }

      // if there is user, compare password
      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({errors: {msg: ['Invalid Credentials']}});
      }

      // use jwt to return token for user
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
});

module.exports = router;