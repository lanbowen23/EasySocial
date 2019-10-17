const express = require('express');
const router = express.Router();  // forget ()
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// req header with token
// route protected using auth middleware
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        // forget req.user || await is on the right side
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;