//@flow

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();

const DB = type => {
  // Since this type comes from the URL, it may come from hackers, and generates a filename, so we need to:
  // 1. ensure that it has a normal length 
  // 2. ensure that it has only characters we deem acceptable 
  //    (lowercase ascii, upercase, digits, dash and underscore)
  const safeType = Array.from(type.slice(0, 100)).filter(ch => /[a-zA-Z0-9-_]/.test(ch)).join('')

  return path.join(os.tmpdir(), `db-${safeType}.json`);
}

app.use(cors({allowedOrigins: ['*']}));

app.get('/:type', (req, res) => {
  fs.readFile(DB(req.params.type), (err, content) => {
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

app.get('/:type/:id', (req, res) => {
  fs.readFile(DB(req.params.type), (err, content) => {
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

app.use('/:type', bodyParser.json());

app.put('/:type/:id', (req, res) => {
  fs.readFile(DB(req.params.type), (err, content) => {
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

      fs.writeFile(DB(req.params.type), JSON.stringify(items), err => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).end()
      })
    }
  })
});

app.delete('/:type/:id', (req, res) => {
  fs.readFile(DB(req.params.type), (err, content) => {
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

      fs.writeFile(DB(req.params.type), JSON.stringify(items), err => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).end()
      })
    }
  })
});

app.post('/:type', (req, res) => {
  fs.readFile(DB(req.params.type), (err, content) => {
    if (err && err.code !== 'ENOENT') {
      res.status(500).send(err);
    }
    else {
      const items = JSON.parse(content || '[]');

      items.push(req.body);

      fs.writeFile(DB(req.params.type), JSON.stringify(items), err => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).end()
      })
    }
  });
});

app.post('/:type/reset', (req, res) => {
  fs.writeFile(DB(req.params.type), JSON.stringify([{
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