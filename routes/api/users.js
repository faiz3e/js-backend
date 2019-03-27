const express = require('express');
const router = express.Router();

//@route    GET  api/users/test
//@desc     test users route 
//@access   Public
router.get('/test', (request, response) => {
  response.json({ message: 'userWorks' })
})

module.exports = router;