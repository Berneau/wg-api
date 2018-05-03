'use strict'

let mongoose = require('mongoose')
let User = require('../models/user.model')
let Invoice = require('../models/invoice.model')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()
let token = null;
let userId = null;

chai.use(chaiHttp)

describe('Invoice', () => {

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
          token = res.body.token;
          userId = res.body.user._id;
          done()
        })
      })
  })
  
  after((done) => {
    Invoice.remove({}, (err) => {
      done()
    })
  })

  describe('GET invoices', () => {
  
    it('should GET all invoices', (done) => {
      chai.request(server)
        .get('/api/invoices')
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('ok').equal(true)
          res.body.should.have.property('invoices')
          res.body.invoices.should.be.a('array')
          done()
        })
    })
  })

  describe('GET invoice', () => {
  
    it('should GET a invoice by id', (done) => {
      let invoice = new Invoice({
        ownerId: userId,
        sumAmount: 123
      })
  
      chai.request(server)
        .post('/api/invoices')
        .set('authorization', token)
        .send(invoice)
        .end((err, res) => {
          let id = res.body.invoice._id
          
          chai.request(server)
            .get('/api/invoices/' + id)
            .set('authorization', token)
            .send(invoice)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.have.property('ok').equal(true)
              res.body.should.have.property('invoice')
              res.body.invoice.should.have.property('_id').equal(id.toString())
              done()
            })
        })
    })
  })

  describe('POST invoice', () => {
  
    it('should create a invoice if no fields are missing', (done) => {
      let invoice = new Invoice({
        ownerId: userId
      })
      
      chai.request(server)
        .post('/api/invoices')
        .set('authorization', token)
        .send(invoice)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.have.property('ok').equal(true)
          res.body.should.have.property('invoice')
          done()
        })
    })
  })

})