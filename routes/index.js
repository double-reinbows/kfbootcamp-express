var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var guid = require('../src/util/guid');
let dummyDB = {
  products: {
    123123: {
      // id: '123123',
      title: 'banana',
      description: 'good for your health',
      price: 100,
    },
    321321: {
      // id: '321321',
      title: 'apple',
      description: 'taste good',
      price: 13000,
    },
  },
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* GET product. */
router.get('/products', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.json(dummyDB);
});
router.get('/products/:id', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let target = dummyDB.products[req.params.id];
  console.log(target);
  if (target) {
    res.json(target);
  } else {
    console.log('derp');
    res.status(404).send();
  }
});
/* POST product. */
router.post('/products', [
  check('title').exists(), check('description').exists(), check('price').exists().isNumeric()
], function(req, res, next) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  } else {
    let uuid = guid.guid();
    dummyDB.products[uuid] = req.body;
    res.json({id: uuid});
  }
});
/* PUT product. */
router.put('/products/:id', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let target = dummyDB.products[req.params.id];
  if (target) {
    target = req.body;
    res.json(target);
  } else {
    res.status(404).send();
  }
});
/* DELETE product. */
router.delete('/products/:id', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  let target = dummyDB.products[req.params.id];
  if (target) {
    delete dummyDB[req.params.id];
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});
module.exports = router;
