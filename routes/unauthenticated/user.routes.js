let bcrypt = require('bcrypt');
let saltRounds = require('../../config').saltRounds;
let userIsValid = require('../../helpers').userIsValid;
let stripUserObject = require('../../helpers').stripUserObject;
let User = require('../../models/user.model');


module.exports = (router) => {

  router.route('/users')

  /**
    * @api {post} /users Create User
    * @apiName CreateUser
    * @apiGroup Users
    * @apiPermission none
    *
    * @apiParam {String} username The username address of the user.
    * @apiParam {String} password The password of the user.
    *
    * @apiSuccess {Object} user The created user.
  */
  .post((req, res) => {

    // not a valid user object
    if (!userIsValid(req.body)) return res.status(412).json({
      ok: false,
      message: 'Not a valid user object'
    })
    
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      
      let user = new User({
        username: req.body.username,
        password: hash
      })

      user.save((err) => {

        // Err Code 11000 = duplicate Key in MongoDB, username already exists
        if (err && err.code == 11000) return res.status(200).json({
          ok: false,
          message: 'Username already taken'
        })

        // internal server error
        if (err) return res.status(500).json({
          ok: false,
          err: err.message
        })

        // return created user object
        res.status(200).json({
          ok: true,
          user: stripUserObject(user)
        })
      })
    })
  })
}
