//@flow

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

const DB = path.join(os.tmpdir(), 'db.json');

app.use(cors({allowedOrigins: ['*']}));

app.get('/items', (req, res) => {
  fs.readFile(DB, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.json([]);
      }
      else {
        res.status(500).send(err);
      }
    }
    else {
      res.json(JSON.parse(content));
    }
  })
});

app.get('/items/:id', (req, res) => {
  fs.readFile(DB, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.json(null);
      }
      else {
        res.status(500).send(err);
      }
    }
    else {
      const items = JSON.parse(content);
      const {item} = findById(items, req.params.id)
      if (!item) {
        res.sendStatus(404);
      }
      else {
        res.json(item);
      }
    }
  })
});

app.use('/items', bodyParser.json());

app.put('/items/:id', (req, res) => {
  fs.readFile(DB, (err, content) => {
    if (err && err.code !== 'ENOENT') {
      res.status(500).send(err);
    }
    else {
      const items = JSON.parse(content || '[]');
      const {item, index} = findById(items, req.params.id);

      if (index === undefined) {
        return res.sendStatus(404);
      }

      items[index] = Object.assign({id: item.id}, req.body);

      fs.writeFile(DB, JSON.stringify(items), err => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).end()
      })
    }
  })
});

app.delete('/items/:id', (req, res) => {
  fs.readFile(DB, (err, content) => {
    if (err && err.code !== 'ENOENT') {
      res.status(500).send(err);
    }
    else {
      const items = JSON.parse(content || '[]');
      const { index } = findById(items, req.params.id);

      if (index === undefined) {
        return res.sendStatus(404);
      }

      items.splice(index, 1);

      fs.writeFile(DB, JSON.stringify(items), err => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).end()
      })
    }
  })
});

app.post('/items', (req, res) => {
  fs.readFile(DB, (err, content) => {
    if (err && err.code !== 'ENOENT') {
      res.status(500).send(err);
    }
    else {
      const items = JSON.parse(content || '[]');

      items.push(req.body);

      fs.writeFile(DB, JSON.stringify(items), err => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).end()
      })
    }
  });
});

app.post('/reset', (req, res) => {
  fs.writeFile(DB, JSON.stringify([{
    id: 'hill',
    name: 'Hillary Clinton',
    age: 69,
    gender: 'female'
  },
  {
    id: 'bill',
    name: 'Bill Clinton',
    age: 70,
    gender: 'male'
  }]), (err) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.sendStatus(200);
    }
  })
});

const findById = (items, id) => {
  const index = items.findIndex(item => item.id === id);

  if (index === -1) {
    const index = parseInt(id, 10);
    const item = items[index];

    return {item, index: item ? index : undefined};
  } else {
    return {item: items[index], index};
  }
}

module.exports = app;