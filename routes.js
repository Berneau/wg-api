let express = require('express');
let jwt = require('jsonwebtoken');
let secret = require('./config').secret;
let router = express.Router();


// unauthenticated routes
require('./routes/unauthenticated/auth.routes')(router);
require('./routes/unauthenticated/user.routes')(router);


router.use((req, res, next) => {

  let token = req.headers['authorization'];
  
  // no token
  if (!token) return res.status(412).json({
    ok: false,
    message: 'No token provided'
  })
  
  // verifies secret and checks expiration
  jwt.verify(token, secret, (err, decoded) => {

    if (err) return res.status(403).json({
      ok: false,
      message: 'Authentication failed'
    })

    // auth success
    next();
  })
})


// authenticated routes
require('./routes/authenticated/user.routes')(router);
require('./routes/authenticated/invoice.routes')(router);
require('./routes/authenticated/operations.routes')(router);


// admin check
// router.use((req, res, next) => {
// 
//   let token = req.headers['authorization'];
// 
//   jwt.verify(token, secret, (err, decoded) => {
// 
//     if (!decoded._doc.isAdmin) return res.status(403).json({
//       ok: false,
//       message: 'Admin rights required'
//     })
// 
//     next();
//   })
// })

// admin routes


module.exports = router;
