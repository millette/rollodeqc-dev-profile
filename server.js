#!/usr/bin/env node
0 > 1 // see https://github.com/babel/babel-eslint/issues/163

'use strict'

// npm
const express = require('express')
const fetchRepos = require('rollodeqc-gh-repos')
const fetchUser = require('rollodeqc-gh-user')
const fetchEvents = require('rollodeqc-gh-user-events')
const PouchDB = require('pouchdb')

const app = express()
const router = express.Router()
const db = new PouchDB('db/devs')

app.set('view engine', 'jade')

const reValid = new RegExp('^[a-z0-9]+(-{0,1}[a-z0-9]+)*$', 'i')
const invalidUsername = (req, res) => {
  const invalid = !reValid.test(req.params.id)
  if (invalid && res) {
    console.log('bad param:', req.params.id)
    res.send('bad param: ' + req.params.id)
  }
  return invalid
}

const handleJson = (type) => {
  router.get(`/index3/:id/${type}.json`, (req, res) => {
    if (invalidUsername(req, res)) { return }
    db.get(req.params.id)
      .then((zz) => {
        res.set('Content-Type', 'application/json')
        if (type === 'user') {
          delete zz.repos
          delete zz.events
          res.send(JSON.stringify(zz, null, ' '))
        } else {
          res.send(JSON.stringify(zz[type], null, ' '))
        }
      })
      .catch((e) => {
        console.log('GIVE ME AN E:', e)
        res.status(404).send('GIVE ME AN E: ' + e)
      })
  })
}

handleJson('repos')
handleJson('events')
handleJson('user')

router.get('/index3/:id', (req, res) => {
  'use strict'
  // SyntaxError: Block-scoped declarations (let, const, function, class)
  // not yet supported outside strict mode
  let p1

  if (invalidUsername(req)) {
    console.log('bad param:', req.params.id)
    p1 = false
  } else {
    // username (login) is valid
    // do we have it in our DB?
    p1 = db.get(req.params.id)
      .then((bla) => {
        if (bla.login) { return bla }
        db.remove(bla._id, bla._rev)
        return false
      })
      .catch((e) => {
        if (e.status !== 404) { return Promise.reject(e) }
        // not in our DB, fetch it from github api
        return Promise.all([
          fetchUser(req.params.id),
          fetchRepos(req.params.id),
          fetchEvents(req.params.id)
        ])
        .then((gf) => {
          const newDoc = gf[0]
          newDoc._id = newDoc.login
          newDoc.repos = gf[1]
          newDoc.events = gf[2]
          db.put(newDoc)
          return newDoc
        })
        .catch((e) => {
          if (e.status !== 404) { return Promise.reject(e) }
          return false
        })
      })
  }

  Promise.all([p1, db.info()])
    .then((out) => {
      const res2 = out[0]
      const info = out[1]
      res.render('index3', {
        title: 'Hey',
        message: 'Hello there!',
        h2: req.params.id,
        pre: JSON.stringify({ info: info, res2: res2 }, null, ' ')
      })
    })
    .catch((e) => {
      console.log('OUPSY:', e)
    })
})

app.use(express.static('dist'))
app.use(router)

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
