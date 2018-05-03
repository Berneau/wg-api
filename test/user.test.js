'use strict'

let mongoose = require('mongoose')
let User = require('../models/user.model')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()
let token = null

chai.use(chaiHttp)

describe('User', () => {

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
          token = res.body.token
          done()
        })
      })
  })
  
  after((done) => {
    User.remove({}, (err) => {
      done()
    })
  })

  describe('GET users', () => {

    it('should GET all users', (done) => {
      chai.request(server)
        .get('/api/users')
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('ok').equal(true)
          res.body.should.have.property('users')
          res.body.users.should.be.a('array')
          done()
        })
    })
  })

  describe('GET user', () => {

    it('should GET a user by id', (done) => {
      let user = new User({
        username: 'fooby',
        password: 'noob'
      })

      chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          let id = res.body.user._id

          chai.request(server)
            .get('/api/users/' + id)
            .set('authorization', token)
            .send(user)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.have.property('ok').equal(true)
              res.body.should.have.property('user')
              res.body.user.should.have.property('_id').equal(id.toString())
              done()
            })

        })
    })
  })

  describe('POST user', () => {

    it('should create a user if no fields are missing', (done) => {
      let user = new User({
        username: 'barsy',
        password: 'test'
      })

      chai.request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('ok').equal(true)
          res.body.should.have.property('user')
          done()
        })
    })
  })

})