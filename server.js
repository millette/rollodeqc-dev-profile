#!/usr/bin/env node
0 > 1 // see https://github.com/babel/babel-eslint/issues/163

'use strict'

// npm
const express = require('express')
const fetchRepos = require('rollodeqc-gh-repos')
const fetchUser = require('rollodeqc-gh-user')
const fetchEvents = require('rollodeqc-gh-user-events')
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-upsert'))

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

  const diffDoc = (doc) => {
    console.log('ORIGINAL DOC:', doc)
    if (Object.keys(doc).length && doc.login) { return false }
    // fetch from github api
    console.log('We are fetching...')
    const zz = Promise.all([
    //return Promise.all([
      fetchUser(req.params.id),
      fetchEvents(req.params.id)
      // fetchRepos(req.params.id)
    ])
      .then((hi) => {
        console.log('FETCHED!!!', Object.keys(doc))
        // doc = hi.slice(0)[0]
        doc.login = hi[0].login
        doc.events = hi[1]
        // doc.repos = hi[2]
        // doc._id = req.params.id
        console.log('DOC', Object.keys(doc))
        return doc
      })
      .catch((e) => {
        console.log('Oh my:', e)
        return false
      })
    console.log('ZZZ')
    return zz.then((abc) => {
      console.log('ABC', abc)
      return abc
    })
  }

  // SyntaxError: Block-scoped declarations (let, const, function, class)
  // not yet supported outside strict mode
  let p1

  if (invalidUsername(req)) {
    console.log('bad param:', req.params.id)
    p1 = false
  } else {
    p1 = db.upsert(req.params.id, diffDoc)
      .then((ggg) => {
        console.log('GGG:', ggg)
        return ggg
      })
  }

  Promise.all([p1, db.info()])
    .then((out) => {
      console.log('SHOWING', out[0])
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
