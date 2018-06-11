'use strict'

let mongoose = require('mongoose')
let User = require('../models/user.model')
let Task = require('../models/task.model')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()
let token = null;
let userId = null;

chai.use(chaiHttp)

describe('Task', () => {

  before((done) => {
    let user = new User({
      username: 'berneau',
      password: 'secret'
    })
    
    chai.request(server)
      .post('/api/users')
      .send(user)
      .end((err, res) => {

        chai.request(server)
        .post('/api/auth')
        .send(user)
        .end((err, res) => {
          token = res.body.jwt.token;
          userId = res.body.user._id;
          done()
        })
      })
  })
  
  after((done) => {
    Task.remove({}, (err) => {
      done()
    })
  })

  describe('GET tasks', () => {
  
    it('should GET all tasks', (done) => {
      chai.request(server)
        .get('/api/tasks')
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('ok').equal(true)
          res.body.should.have.property('tasks')
          res.body.tasks.should.be.a('array')
          done()
        })
    })
  })

  describe('GET task', () => {
  
    it('should GET a task by id', (done) => {
      let task = new Task({
        reporterId: userId,
        title: 'Lorem'
      })
  
      chai.request(server)
        .post('/api/tasks')
        .set('authorization', token)
        .send(task)
        .end((err, res) => {
          let id = res.body.task._id
          
          chai.request(server)
            .get('/api/tasks/' + id)
            .set('authorization', token)
            .send(task)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.have.property('ok').equal(true)
              res.body.should.have.property('task')
              res.body.task.should.have.property('_id').equal(id.toString())
              done()
            })
        })
    })
  })

  describe('POST task', () => {
  
    it('should create a task if no fields are missing', (done) => {
      let task = new Task({
        reporterId: userId,
        title: 'Lorem'
      })
      
      chai.request(server)
        .post('/api/tasks')
        .set('authorization', token)
        .send(task)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('ok').equal(true)
          res.body.should.have.property('task')
          done()
        })
    })
    
    it('should not create a task if fields are missing', (done) => {
      let task = new Task({
        title: 'Lorem'
      })
      
      chai.request(server)
        .post('/api/tasks')
        .set('authorization', token)
        .send(task)
        .end((err, res) => {
          res.should.have.status(412)
          res.body.should.have.property('ok').equal(false)
          res.body.should.have.property('err').equal('Not a valid task object')
          done()
        })
    })
  })

})