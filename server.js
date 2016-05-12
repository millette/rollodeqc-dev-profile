'use strict'

const express = require('express')
const app = express()
const router = express.Router()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-upsert'))

const db = new PouchDB('db/devs')

app.set('view engine', 'jade')

router.get('/index3/:id/repos.json', (req, res) => {
  if (!/^[a-zA-Z0-9]+(-{0,1}[a-zA-Z0-9]+)*$/.test(req.params.id)) {
    console.log('bad param:', req.params.id)
    res.send('bad param: ' + req.params.id)
    return
  }

  db.get(req.params.id)
    .then((zz) => {
      console.log('ZZ:', zz)
      res.set('Content-Type', 'application/json')
      res.send(JSON.stringify(zz.repos, null, ' '))
    })
    .catch((e) => {
      console.log('GIVE ME AN E:', e)
      res.status(404).send('GIVE ME AN E: ' + e)
    })
})

router.get('/index3/:id/events.json', (req, res) => {
  if (!/^[a-zA-Z0-9]+(-{0,1}[a-zA-Z0-9]+)*$/.test(req.params.id)) {
    console.log('bad param:', req.params.id)
    res.send('bad param: ' + req.params.id)
    return
  }

  db.get(req.params.id)
    .then((zz) => {
      console.log('ZZ:', zz)
      res.set('Content-Type', 'application/json')
      res.send(JSON.stringify(zz.events, null, ' '))
    })
    .catch((e) => {
      console.log('GIVE ME AN E:', e)
      res.status(404).send('GIVE ME AN E: ' + e)
    })
})

router.get('/index3/:id/user.json', (req, res) => {
  if (!/^[a-zA-Z0-9]+(-{0,1}[a-zA-Z0-9]+)*$/.test(req.params.id)) {
    console.log('bad param:', req.params.id)
    res.send('bad param: ' + req.params.id)
    return
  }

  db.get(req.params.id)
    .then((zz) => {
      console.log('ZZ:', zz)
      delete zz.repos
      delete zz.events
      res.set('Content-Type', 'application/json')
      res.send(JSON.stringify(zz, null, ' '))
    })
    .catch((e) => {
      console.log('GIVE ME AN E:', e)
      res.status(404).send('GIVE ME AN E: ' + e)
    })
})

router.get('/index3/:id', (req, res) => {
  console.log('CALLING /index3/:id', new Date())

  let p1
  if (!/^[a-zA-Z0-9]+(-{0,1}[a-zA-Z0-9]+)*$/.test(req.params.id)) {
    console.log('bad param:', req.params.id)
    p1 = false
  } else {
    p1 = db.upsert(req.params.id, (doc) => {
      console.log('doc1:', req.params.id, doc)

      if (Object.keys(doc).length && doc.login) { return false }

      try {
        doc = require(`./bof/users/${req.params.id}/user.json`)
        doc.events = require(`./bof/users/${req.params.id}/events.json`)
        doc.repos = require(`./bof/users/${req.params.id}/repos.json`)
        return doc
      } catch (e) {
        console.log('Oh my:', e)
        return false
      }
    })
  }

  Promise.all([p1, db.info()])
  .then((out) => {
    const res2 = out[0]
    const info = out[1]
    console.log('res2:', res2)
    console.log('info:', info)
    res.render('index3', {
      title: 'Hey',
      message: 'Hello there!',
      h2: req.params.id,
      pre: JSON.stringify(info, null, ' ')
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
