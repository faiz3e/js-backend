const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs');
var jwt = require('jsonwebtoken');
var keys = require('../../config/keys');

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
        bcryptjs.genSalt(10, (err, salt) => {     // 128-bit salt 
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
// router.post('/login', (request, response) => {
//   // response.json({ message: 'login' })
//   const email = request.body.email;
//   const password = request.body.password;
//   User.findOne({ email })
//     .then(user => {
//       if (!user) {
//         return response.status(404).json({ error: 'email not found' })
//       }
//       bcryptjs.compare(password, user.password).then(isMatch => {
//         if (isMatch) {
//           response.json({ msg: 'success' })
//         } else {
//           return response.status(400).json({ error: 'password is incorrect ' })
//         }
//       })
//     })
// })



//@route    GET  api/users/login
//@desc     login users route return token  
//@access   Public

router.post('/login', (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  // Find the user by email 
  User.findOne({ email })
    .then(user => {
      if (!user) { return response.status(400).json({ error: 'email address not found' }) }
      bcryptjs.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //jwt web token 
          const payload = { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
          jwt.sign(
            payload,
            keys.SECRET_KEY,
            { expiresIn: 3600 },
            (err, token) => {
              response.json({
                success: true,
                token: 'Bearer ' + token
              })
            });
          // response.json({ msg: 'success' })
        } else {
          return response.status(400).json({ error: 'password incorrect' })
        }
      })
    })
})


module.exports = router;