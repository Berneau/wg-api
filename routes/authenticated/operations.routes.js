let Invoice = require('../../models/invoice.model');

module.exports = (router) => {
  
  router.route('/operations/summary')
  
  /**
  * @api {get} /operations/summary Get summary of month
  * @apiName GetSummary
  * @apiGroup Operations
  * @apiPermission authenticated
  *
  * @apiSuccess {Summary} summary Summary object of month.
  */
  .get((req, res) => {
    
    if (!req.query.month) return res.status(412).json({
      ok: false,
      err: 'No month given'
    })

    Invoice.find({
      month: req.query.month,
      deleted: false
    }, (err, invoices) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })
      
      // calculate summary by user
      let users = calculateSummary(invoices);
      
      // return summary
      res.status(200).json({
        ok: true,
        summary: {
          users: users
        }
      })
    })
  })
}


function calculateSummary(invoices) {
  
  let userMap = new Map();
  invoices.forEach((invoice) => {
    let user = userMap.get(invoice.ownerId);
  
    if (!user) {
      userMap.set(invoice.ownerId, { sum: 0 });
      user = userMap.get(invoice.ownerId);
    }
  
    userMap.set(invoice.ownerId, { sum: user.sum + invoice.amountToSplit })
  })
  
  let users = [];
  userMap.forEach((val, key) => {
    users.push({ id: key, sum: val.sum })
  })
  
  return users;
}