let Task = require('../../models/task.model');
let taskIsValid = require('../../helpers').taskIsValid;
let taskFactory = require('../../helpers').taskFactory;

module.exports = (router) => {
  
  router.route('/tasks')
  
  /**
  * @api {get} /tasks Get all tasks
  * @apiName GetTasks
  * @apiGroup Tasks
  * @apiPermission authenticated
  *
  * @apiSuccess {Array} tasks Array of tasks.
  */
  .get((req, res) => {
    
    Task.find({
      deleted: false
    }, (err, tasks) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // return tasks list
      res.status(200).json({
        ok: true,
        tasks: tasks
      })
    })
    .sort({ title: 1 })
  })

  /**
    * @api {post} /tasks Create Task
    * @apiName CreateTask
    * @apiGroup Tasks
    * @apiPermission authenticated
    *
    * @apiParam {String} title The title of the task.
    * @apiParam {String} reporterId id of the creator of the task.
    * @apiParam {String} assigneeId of of the assignee of the task.
    * @apiParam {String} note optional notes.
    * @apiParam {String} categoryId if of the category.
    * @apiParam {Date} dueTo date until task needs to be done.
    * @apiParam {Boolean} deleted task is deleted.
    *
    * @apiSuccess {Object} task The created task.
  */
  .post((req, res) => {

    // not a valid task object
    if (!taskIsValid(req.body)) return res.status(412).json({
      ok: false,
      message: 'Not a valid task object'
    })

    let task = new Task();
    task = taskFactory(task, req.body);

    task.save((err) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // return created task object
      res.status(200).json({
        ok: true,
        task: task
      })
    })
  })

  router.route('/tasks/:id')

  /**
  * @api {get} /tasks/:id Get task
  * @apiName GetTask
  * @apiGroup Tasks
  * @apiPermission authenticated
  *
  * @apiSuccess {Object} task The task for given id.
  */
  .get((req, res) => {

    Task.findById(req.params.id, (err, task) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // no task with this id
      if (!task) return res.status(404).json({
        ok: false,
        message: 'Task not found'
      })

      // return task object
      res.status(200).json({
        ok: true,
        task: task
      })
    })
  })

  /**
  * @api {put} /tasks/:id Update task
  * @apiName UpdateTasks
  * @apiGroup Tasks
  * @apiPermission authenticated
  *
  * @apiParam {String} title The title of the task.
  * @apiParam {String} reporterId id of the creator of the task.
  * @apiParam {String} assigneeId of of the assignee of the task.
  * @apiParam {String} note optional notes.
  * @apiParam {String} categoryId if of the category.
  * @apiParam {Date} dueTo date until task needs to be done.
  * @apiParam {Boolean} deleted task is deleted.
  *
  * @apiSuccess {Object} task The updated task for given id.
  */
  .put((req, res) => {

    Task.findById(req.params.id, (err, task) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // no task with this id
      if (!task) return res.status(404).json({
        ok: false,
        message: 'Task not found'
      })

      task = taskFactory(req.body, task);

      task.save((err) => {

        // internal server error
        if (err) return res.status(500).json({
          ok: false,
          err: err.message
        })

        // return updated task object
        res.status(200).json({
          ok: true,
          task: task
        })
      })
    })
  })


  /**
  * @api {delete} /tasks/:id?delete=<true:false> Delete task
  * @apiName DeleteTask
  * @apiGroup Tasks
  * @apiPermission authenticated
  *
  * @apiSuccess {Object} task The deleted task for given id.
  */
  .delete((req, res) => {

    Task.findById(req.params.id, (err, task) => {

      // internal server error
      if (err) return res.status(500).json({
        ok: false,
        err: err.message
      })

      // no task with this id
      if (!task) return res.status(404).json({
        ok: false,
        message: 'Task not found'
      })

      task.deleted = req.query.shouldDelete;

      task.save((err) => {

        // internal server error
        if (err) return res.status(500).json({
          ok: false,
          err: err.message
        })

        // return updated task object
        res.status(200).json({
          ok: true,
          task: task
        })
      })
    })
  })
}