'use strict';

//model representing cities with weather data
var CityModel = require('../models/city');

module.exports = function (app) {

	//process get requests
	app.get('/', function (req, res) {
		//generate weather model and render in callback
		new CityModel(function (model) {
			res.render('index', model);
		}); 
	});

};
