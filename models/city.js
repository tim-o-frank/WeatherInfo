'use strict';

var cityName;

/**
 * Get weather data for 3 cites and return a model.
 *
 * @param {Object} generateWeatherModel - Function that takes in the weather data
 *   and renders the result.
 *
 */
function getResponseCity (generateWeatherModel) {

	var request = require('request');
	//list of cities for which weather data is needed
	var cities = ["CA/Campbell", "NE/Omaha", "MD/Timonium"];
	//url for weather underground
	var urlPrefix = 'http://api.wunderground.com/api/82aef0677c902b86/conditions/q/';
	//list containing each cities weather data
	var citiesWeatherData = [];
	//get weather data for each city in cities
	for (var index = 0; index < cities.length; ++index){
		//generate url
		var url = urlPrefix + cities[index] + ".json";
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var responseObject = JSON.parse(body);
				//skip the city if error data is returned 
				if (!responseObject.error){
					var cityModel;
					if (responseObject.current_observation != null){
						cityModel = {
							name : responseObject.current_observation.display_location.full,
							temp : responseObject.current_observation.temp_f,
							weather : responseObject.current_observation.weather
						}
					} else {
						cityModel = {
							name : "no data for " + cities[index],
						}
					}
					//add the data to the list
					citiesWeatherData.push(cityModel);
					console.log(cityModel);
					console.log(citiesWeatherData);
				} else {
					//log the error and make response available to UI
					console.log(responseObject.error);
					var errorModel = {
						"error" : error
					}
					citiesWeatherData.push(errorModel);
				}
			} else {
				console.log(error);
				//put the error on the response for 2 reasons 1. UI can display it if so desired and
				//2. the size of citiesWeatherData will continue to go up so a response will still
				//be delivered.
				var errorModel = {
					"error" : error
				}
				citiesWeatherData.push(errorModel);
			}
			
			generateResponse(cities, citiesWeatherData, generateWeatherModel);
		})
	}
}

/**
 * Checks to see if all cities have been processed.  If they have, a model is passed to the
 *  callback responsible for generating a response.
 *
 * @param {List} cities - List of cities for which weather data is needed.
 *   
 * @param {List} citiesWeatherData - Weather data responses for cities.
 * 
 * @param {Object} generateWeatherModel - Function that takes in the weather data
 *   and renders the result.
 *
 */
function generateResponse(cities, citiesWeatherData, generateWeatherModel){
	
	//if responses have been received for each city, invoke callback
	if (cities.length == citiesWeatherData.length){
		console.log("done");
		var weatherModel = {
			name : "Human",
			cities : citiesWeatherData
		}
		generateWeatherModel(weatherModel);
	} 
}

/**
 * Invoke the model generation method called from the controller.
 *
 * @param {Object} generateWeatherModel - Function that takes in the weather data
 *   and renders the result.
 *
 */
module.exports = function CityModel(generateWeatherModel) {

	getResponseCity(generateWeatherModel);

};
