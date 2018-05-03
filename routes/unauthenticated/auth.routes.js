let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let stripUserObject = require('../../helpers').stripUserObject
let User = require('../../models/user.model');
let secret;

// set secret
if (process.env.NODE_ENV === 'PRODUCTION') {
  secret = process.env.secret
} else {
  secret = require('../../config').secret;
}

module.exports = (router) => {

  router.route('/auth')

  /**
   * @api {post} /auth Get JWT
   * @apiName GETJWT
   * @apiGroup Authentication
   * @apiPermission none
   *
   * @apiParam {String} username The username of the user.
   * @apiParam {String} password The password of the user.
   *
   * @apiSuccess {String} token The signed JWT.
   * @apiSuccess {Object} user The user for the login.
 */
  .post((req, res) => {

    User.findOne({ username: req.body.username }, (err, user) => {
      
      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // user with this username was not found
      if (!user) return res.status(403).json({
        ok: false,
        message: 'Authentication failed'
      })

      bcrypt.compare(req.body.password, user.password, (err, result) => {

        // error during matching
        if (err) return res.status(500).json({
          ok: false,
          message: 'Authentication failed'
        })

        // username and password doesn't match
        if (!result) return res.status(403).json({
          ok: false,
          message: 'Authentication failed'
        })

        let token = jwt.sign(
          { isAdmin: user.isAdmin },
          secret,
          { expiresIn: '24h' }
        )

        // return token and user
        res.status(200).json({
          ok: true,
          token: token,
          user: stripUserObject(user)
        })
      })
    })
  })
}
