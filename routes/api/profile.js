const express = require('express');
const router = express.Router();

//@route    GET  api/profile/test
//@desc     test profile route 
//@access   Public
router.get('/test', (request, response) => {
  response.json({ message: 'profileWorks' })
})

module.exports = router;