// server.js

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');

// parse do form e json
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// conexão mongo
mongoose.connect('mongodb://localhost/bear');

// rotas
var router = express.Router();

router.use(function(req, res, next) {
	console.log('rotas');
	next();
});

router.route('/bears')
	.post(function(req, res) {
		var bear = new Bear();
		bear.name = req.body.name;

		bear.save(function(err) {
			if (err) {
				res.send(err);
			}
			res.json({message: 'Bear created'});
		});
	})
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err) {
				res.send(err);
			}
			res.json(bears);
		});
	});

router.route('/bears/:bear_id')
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err) {
				res.send(err);
			}
			res.json(bear);
		});
	})
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if(err) {
				res.send(err);
			}

			bear.name = req.body.name; 

			bear.save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json({message: 'Bear updated'});
			});
		});		
	})
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err) {
				res.send(err);
			}
			res.json({message: 'Bear deleted'});
		});
	});

router.get('/', function(req, res) {
	res.json({msg: 'API'});
});

// registro das rotas - todas serão prefixadas com /api
app.use('/api', router);

// start servidor
app.listen(3000);
console.log('servidor executando na porta 3000...');