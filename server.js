'use strict'

const express = require('express')
const app = express()
const router = express.Router()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-upsert'))

const db = new PouchDB('db/devs')

app.set('view engine', 'jade')

const reValid = new RegExp('^[a-z0-9]+(-{0,1}[a-z0-9]+)*$', 'i')
const invalidUsername = (req, res) => {
  const x = !reValid.test(req.params.id)
  if (x && res) {
    console.log('bad param:', req.params.id)
    res.send('bad param: ' + req.params.id)
  }
  return x
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
  let p1
  if (invalidUsername(req)) {
    console.log('bad param:', req.params.id)
    p1 = false
  } else {
    p1 = db.upsert(req.params.id, (doc) => {
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
