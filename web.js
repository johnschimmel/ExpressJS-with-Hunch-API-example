var requestURL = require('request');
var express = require('express'); 
var ejs = require('ejs'); //embedded javascript template engine

var app = express.createServer(express.logger());

var mongoose = require('mongoose'); // include Mongoose MongoDB library
var schema = mongoose.Schema; 

/************ DATABASE CONFIGURATION **********/
//app.db = mongoose.connect(process.env.MONGOLAB_URI); //connect to the mongolabs database - local server uses .env file

// Include models.js - this file includes the database schema and defines the models used
//require('./models').configureSchema(schema, mongoose);

// Define your DB Model variables
//var BlogPost = mongoose.model('BlogPost');
//var Comment = mongoose.model('Comment');
/************* END DATABASE CONFIGURATION *********/


/*********** SERVER CONFIGURATION *****************/
app.configure(function() {
    
    
    /*********************************************************************************
        Configure the template engine
        We will use EJS (Embedded JavaScript) https://github.com/visionmedia/ejs
        
        Using templates keeps your logic and code separate from your HTML.
        We will render the html templates as needed by passing in the necessary data.
    *********************************************************************************/

    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    /******************************************************************
        The /static folder will hold all css, js and image assets.
        These files are static meaning they will not be used by
        NodeJS directly. 
        
        In your html template you will reference these assets
        as yourdomain.heroku.com/img/cats.gif or yourdomain.heroku.com/js/script.js
    ******************************************************************/
    app.use(express.static(__dirname + '/static'));
    
    //parse any http form post
    app.use(express.bodyParser());
    
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});
/*********** END SERVER CONFIGURATION *****************/



// main page - display all blog posts
app.get('/', function(req, res) {
    
    url = "http://api.hunch.com/api/v1/get-recommendations/?auth_token=d25dbef5e3805ea9aac48f677dbc97aa8745722e&topic_ids=list_book&reverse"
    requestURL(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            hunchData = JSON.parse(body);

            var templateData = {
                'url' : url,
                'totalRecs' : hunchData.total,
                'hunchRecs' : hunchData.recommendations
            }

            res.render("hunch_display.html",templateData)
            res.send("got it");
        }
    });

});
// end of main page



// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});