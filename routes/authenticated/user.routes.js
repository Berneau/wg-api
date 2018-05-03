let userIsValid = require('../../helpers').userIsValid;
let stripUserObject = require('../../helpers').stripUserObject;
let stripUserArray = require('../../helpers').stripUserArray;
let userFactory = require('../../helpers').userFactory;
let User = require('../../models/user.model');

module.exports = (router) => {

  router.route('/users/:id')

  /**
  * @api {get} /users/:id Get user
  * @apiName GetUser
  * @apiGroup Users
  * @apiPermission authenticated
  *
  * @apiSuccess {Object} user The user for given id.
  */
  .get((req, res) => {

    User.findById(req.params.id, (err, user) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // no user with this id
      if (!user) return res.status(404).json({
        ok: false,
        message: 'User not found'
      })

      // return user object
      res.status(200).json({
        ok: true,
        user: stripUserObject(user)
      })
    })
  })

  // TODO: set apiParam

  /**
  * @api {put} /users/:id Update user
  * @apiName UpdateUser
  * @apiGroup Users
  * @apiPermission admin
  *
  *
  *
  * @apiSuccess {Object} user The updated user object.
 */
  .put((req, res) => {

    User.findById(req.params.id, (err, user) => {

      // not a valid id
      if (err && err.name != 'CastError') return res.status(404).json({
        ok: false,
        err: err.message
      })

      // no user with this id
      if (!user) return res.status(404).json({
        ok: false,
        message: 'User not found'
      })

      // not a valid user
      if (!userIsValid(req.body)) return res.status(412).json({
        ok: false,
        message: 'Missing fields'
      })

      user = userFactory(user, req.body);

      user.save((err) => {

        // internal server error
        if (err) return res.status(500).json({
          ok: false,
          err: err.message
        })

        // return the updated postit
        return res.status(200).json({
          ok: true,
          postit: postit
        })
      })
    })
  })

  router.route('/users')

  /**
  * @api {get} /users Get all users
  * @apiName GetUsers
  * @apiGroup Users
  * @apiPermission admin
  *
  * @apiSuccess {Array} user Array of users.
  */
  .get((req, res) => {

    User.find({}, (err, users) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // return user list
      res.status(200).json({
        ok: true,
        users: stripUserArray(users)
      })
    })
    .sort({ username: 1 })
  })
}
