'use strict'

let mongoose = require('mongoose')
let User = require('../models/user.model')
let Category = require('../models/category.model')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()
let token = null;
let userId = null;

chai.use(chaiHttp)

describe('Category', () => {

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
    Category.remove({}, (err) => {
      done()
    })
  })

  describe('GET categories', () => {
  
    it('should GET all categories', (done) => {
      chai.request(server)
        .get('/api/categories')
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('ok').equal(true)
          res.body.should.have.property('categories')
          res.body.categories.should.be.a('array')
          done()
        })
    })
  })

  describe('GET category', () => {
  
    it('should GET a category by id', (done) => {
      let category = new Category({
        title: 'Lorem'
      })
  
      chai.request(server)
        .post('/api/categories')
        .set('authorization', token)
        .send(category)
        .end((err, res) => {
          let id = res.body.category._id
          
          chai.request(server)
            .get('/api/categories/' + id)
            .set('authorization', token)
            .send(category)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.have.property('ok').equal(true)
              res.body.should.have.property('category')
              res.body.category.should.have.property('_id').equal(id.toString())
              done()
            })
        })
    })
  })

  describe('POST category', () => {
  
    it('should create a category if no fields are missing', (done) => {
      let category = new Category({
        title: 'Lorem'
      })
      
      chai.request(server)
        .post('/api/categories')
        .set('authorization', token)
        .send(category)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('ok').equal(true)
          res.body.should.have.property('category')
          done()
        })
    })
    
    it('should not create a category if fields are missing', (done) => {
      let category = new Category({
        color: '#d3d3d3'
      })
      
      chai.request(server)
        .post('/api/categories')
        .set('authorization', token)
        .send(category)
        .end((err, res) => {
          res.should.have.status(412)
          res.body.should.have.property('ok').equal(false)
          res.body.should.have.property('err').equal('Not a valid category object')
          done()
        })
    })
  })

})