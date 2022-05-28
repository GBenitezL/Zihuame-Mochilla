const express = require('express');
const router = express.Router();

const { loginCtrl, registerCtrl } = require('../controllers/auth');

router.route('/login').get(async (req, res) => {
    try {
      res.render('pages/login.ejs');
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  
router.post('/login', loginCtrl);

router.post('/register', registerCtrl);

module.exports = router;