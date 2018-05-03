let Invoice = require('../../models/invoice.model');
let invoiceIsValid = require('../../helpers').invoiceIsValid;
let invoiceFactory = require('../../helpers').invoiceFactory;

module.exports = (router) => {
  
  router.route('/invoices')
  
  /**
  * @api {get} /invoices Get all invoices
  * @apiName GetInvoices
  * @apiGroup Invoices
  * @apiPermission authenticated
  *
  * @apiSuccess {Array} invoice Array of invoices.
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

      // return invoices list
      res.status(200).json({
        ok: true,
        invoices: invoices
      })
    })
    .sort({ date: 1 })
  })

  /**
    * @api {post} /invoices Create Invoice
    * @apiName CreateInvoice
    * @apiGroup Invoices
    * @apiPermission authenticated
    *
    * @apiParam {String} ownerId The id of the owner.
    * @apiParam {amountOriginal} original amount of the invoice.
    * @apiParam {amountPrivate} amount of not splitable entries.
    * @apiParam {amountToSplit} amount of splitable entries.
    * @apiParam {month} month in number form.
    * @apiParam {year} year in number form.
    * @apiParam {date} creation date.
    *
    * @apiSuccess {Object} invoice The created invoice.
  */
  .post((req, res) => {
    
    // not a valid invoice object
    if (!invoiceIsValid(req.body)) return res.status(412).json({
      ok: false,
      message: 'Not a valid invoice object'
    })
    
    let invoice = new Invoice();
    invoice = invoiceFactory(invoice, req.body);
    
    invoice.save((err) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // return created invoice object
      res.status(200).json({
        ok: true,
        invoice: invoice
      })
    })
  })
  
  router.route('/invoices/:id')
  
  /**
  * @api {get} /invoices/:id Get invoice
  * @apiName GetInvoice
  * @apiGroup Invoices
  * @apiPermission authenticated
  *
  * @apiSuccess {Object} invoice The invoice for given id.
  */
  .get((req, res) => {
    
    Invoice.findById(req.params.id, (err, invoice) => {
      
      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // no invoice with this id
      if (!invoice) return res.status(404).json({
        ok: false,
        message: 'Invoice not found'
      })

      // return invoice object
      res.status(200).json({
        ok: true,
        invoice: invoice
      })
    })
  })
  
  /**
  * @api {put} /invoices/:id Update invoice
  * @apiName UpdateInvoice
  * @apiGroup Invoices
  * @apiPermission authenticated
  *
  * @apiSuccess {Object} invoice The updated invoice for given id.
  */
  .put((req, res) => {
    
    Invoice.findById(req.params.id, (err, invoice) => {
      
      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })
      
      // no invoice with this id
      if (!invoice) return res.status(404).json({
        ok: false,
        message: 'Invoice not found'
      })
      
      invoice = invoiceFactory(req.body, invoice);
      
      invoice.save((err) => {
        
        // internal server error
        if (err) return res.status(500).json({
          ok: false,
          err: err.message
        })
        
        // return updated invoice object
        res.status(200).json({
          ok: true,
          invoice: invoice
        })
      })
    })
  })
  
  
  /**
  * @api {delete} /invoices/:id?delete=<true:false> Delete invoice
  * @apiName DeleteInvoice
  * @apiGroup Invoices
  * @apiPermission authenticated
  *
  * @apiSuccess {Object} invoice The deleted invoice for given id.
  */
  .delete((req, res) => {
    
    Invoice.findById(req.params.id, (err, invoice) => {
      
      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })
      
      // no invoice with this id
      if (!invoice) return res.status(404).json({
        ok: false,
        message: 'Invoice not found'
      })
      
      console.log(invoice);
      invoice.deleted = req.query.shouldDelete;
      console.log(invoice);
      
      invoice.save((err) => {
        
        // internal server error
        if (err) return res.status(500).json({
          ok: false,
          err: err.message
        })
        
        // return updated invoice object
        res.status(200).json({
          ok: true,
          invoice: invoice
        })
      })
    })
  })
}