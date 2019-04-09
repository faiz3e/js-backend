const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs');
//load user model 

const User = require('../../models/Users')
//@route    GET  api/users/test
//@desc     test users route 
//@access   Public
router.get('/test', (request, response) => {
  response.json({ message: 'userWorks' })
})

//@route    GET  api/users/register
//@desc     register users route 
//@access   Public
router.post('/register', (request, response) => {
  User.findOne({ email: request.body.email })       //? findOne  method returns the first occurrence in the selection.
    .then(user => {
      if (user) {
        return response.status(400).json({ error: 'Email already exists' })   // 400 Bad Request
      }
      else {
        const avatar = gravatar.url(request.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm',
        });
        const newUser = new User({
          name: request.body.name,
          email: request.body.email,
          password: request.body.password,
          avatar
        });
        bcryptjs.genSalt(10, (err, salt) => {
          bcryptjs.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err
            }
            newUser.password = hash;
            newUser.save()
              .then(user => response.json(user))
              .catch(err => console.log(err))
          })
        })
      }
    })
    .catch(err => console.log(err))
})

//@route    GET  api/users/login
//@desc     login users route 
//@access   Public
router.post('/login', (request, response) => {
  // response.json({ message: 'login' })
  const email = request.body.email;
  const password = request.body.password;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return response.status(404).json({ error: 'email not found' })
      }
      bcryptjs.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          response.json({ msg: 'success' })
        } else {
          return response.status(400).json({ error: 'password is incorrect ' })
        }
      })
    })

})

module.exports = router;