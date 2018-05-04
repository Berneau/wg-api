let stripUserArray = require('../../helpers').stripUserArray;
let User = require('../../models/user.model');

module.exports = (router) => {
  
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

