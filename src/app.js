var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var parsedData = [];

app.use(bodyParser.urlencoded({
	extended: true
}));
app.set('views', 'src/views');
app.set('view engine', 'jade'); // is kind of like require

app.get('/', function(request, response) {
	fs.readFile('./users.json', function(err, data) {
		if (err) {
			console.log(err);
		}

		//route 1: renders a page that displays all your users.
		parsedData = JSON.parse(data);
		// console.log(parsedData);
		response.render("index", {
			users: parsedData // this parses the users
		});
	});
});

//route 2: renders a page that displays a form which is your search bar.

app.get('/search', function(request, response) {
	response.render("search");

});

//route 3: takes in the post request from your form, 
//then displays matching users on a new page 
//Users should be matched based on whether either their first or last name contains the input string.
// We need --> file i/o read/write file (people merger), get fruits from array

app.post('/search', function(request, response) {
	fs.readFile('./users.json', function(err, data) {
		if (err) {
			console.log(err);
		}

		var parsedData = JSON.parse(data);
		// console.log(parsedData[0].firstname);

		for (var i = 0; i < parsedData.length; i++) {
			if (parsedData[i].firstname === request.body.firstname || parsedData[i].lastname === request.body.lastname) {
				response.send('data received: ' + JSON.stringify(parsedData[i].firstname + " " + parsedData[i].lastname) + '\n');
			} else {
				response.send("sorry, not found lol");
			}
		}
	});
});

// route 4: renders a page with three forms on it (first name, last name, and email) 
app.get('/registration', function(request, response) {
	response.render("registration");

});

// that allows you to add new users to the users.json file.
app.post('/registration', function(request, response) {
	fs.readFile('./users.json', function(err, data) { // data= json data
		if (err) {
			console.log(err);
		}

		var parsedData = JSON.parse(data); // with parse we turn json data into javascript data
		// console.log(parsedData[0].firstname);
		var fake = {
			firstname: request.body.firstname,
			lastname: request.body.lastname,
			email: request.body.email
		};

		parsedData.push(fake);

		console.log(parsedData);

		if (request.body.firstname) {
			fs.writeFile("./users.json", JSON.stringify(parsedData), function(err) {
				console.error(err)
			})
			response.render("index", {
				users: parsedData // this parses the users
			});
		}
	});
});



// listen to app
var server = app.listen(3000, function() {
	console.log('Example app listening on port: ' + server.address().port);
});


