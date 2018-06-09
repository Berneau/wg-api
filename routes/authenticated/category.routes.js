let Category = require('../../models/category.model');
let categoryIsValid = require('../../helpers').categoryIsValid;
let categoryFactory = require('../../helpers').categoryFactory;

module.exports = (router) => {
  
  router.route('/categories')
  
  /**
  * @api {get} /categories Get all categories
  * @apiName GetCategories
  * @apiGroup Categories
  * @apiPermission authenticated
  *
  * @apiSuccess {Array} category Array of categories.
  */
  .get((req, res) => {
    
    Category.find({
      deleted: false
    }, (err, categories) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // return categories list
      res.status(200).json({
        ok: true,
        categories: categories
      })
    })
    .sort({ title: 1 })
  })

  /**
    * @api {post} /categories Create Invoice
    * @apiName CreateCategory
    * @apiGroup Categories
    * @apiPermission authenticated
    *
    * @apiParam {String} title The title of the category.
    * @apiParam {String} color hex color of category.
    * @apiParam {String} icon font icon name of category.
    * @apiParam {String} note optional notes.
    *
    * @apiSuccess {Object} category The created category.
  */
  .post((req, res) => {

    // not a valid category object
    if (!categoryIsValid(req.body)) return res.status(412).json({
      ok: false,
      message: 'Not a valid category object'
    })

    let category = new Category();
    category = categoryFactory(category, req.body);

    category.save((err) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // return created category object
      res.status(200).json({
        ok: true,
        category: category
      })
    })
  })

  router.route('/categories/:id')

  /**
  * @api {get} /categories/:id Get category
  * @apiName GetCategory
  * @apiGroup Categories
  * @apiPermission authenticated
  *
  * @apiSuccess {Object} category The category for given id.
  */
  .get((req, res) => {

    Category.findById(req.params.id, (err, category) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // no category with this id
      if (!category) return res.status(404).json({
        ok: false,
        message: 'Category not found'
      })

      // return category object
      res.status(200).json({
        ok: true,
        category: category
      })
    })
  })

  /**
  * @api {put} /categories/:id Update category
  * @apiName UpdateCategory
  * @apiGroup Categories
  * @apiPermission authenticated
  *
  * @apiParam {String} title The title of the category.
  * @apiParam {String} color hex color of category.
  * @apiParam {String} icon font icon name of category.
  * @apiParam {String} note optional notes.
  *
  * @apiSuccess {Object} category The updated category for given id.
  */
  .put((req, res) => {

    Category.findById(req.params.id, (err, category) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // no category with this id
      if (!category) return res.status(404).json({
        ok: false,
        message: 'Category not found'
      })

      category = categoryFactory(req.body, category);

      category.save((err) => {

        // internal server error
        if (err) return res.status(500).json({
          ok: false,
          err: err.message
        })

        // return updated category object
        res.status(200).json({
          ok: true,
          category: category
        })
      })
    })
  })


  /**
  * @api {delete} /categories/:id?delete=<true:false> Delete category
  * @apiName DeleteCategory
  * @apiGroup Categories
  * @apiPermission authenticated
  *
  * @apiSuccess {Object} category The deleted category for given id.
  */
  .delete((req, res) => {

    Category.findById(req.params.id, (err, category) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // no category with this id
      if (!category) return res.status(404).json({
        ok: false,
        message: 'Category not found'
      })

      category.deleted = req.query.shouldDelete;

      category.save((err) => {

        // internal server error
        if (err) return res.status(500).json({
          ok: false,
          err: err.message
        })

        // return updated category object
        res.status(200).json({
          ok: true,
          category: category
        })
      })
    })
  })
}