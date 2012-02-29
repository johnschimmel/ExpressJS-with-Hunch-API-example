var requestURL = require('request');
var express = require('express'); 
var ejs = require('ejs'); //embedded javascript template engine

var app = express.createServer(express.logger());


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



// main page 
app.get('/', function(req, res) {
    
    // the url you need to request from hunch
    url = "http://api.hunch.com/api/v1/get-recommendations/?auth_token=d25dbef5e3805ea9aac48f677dbc97aa8745722e&topic_ids=list_book&reverse"

    // make the request to Hunch api
    requestURL(url, function (error, response, hunchJSON) {
        
        // if successful
        if (!error && response.statusCode == 200) {

            // convert hunchJSON into JS object, hunchData
            hunchData = JSON.parse(hunchJSON);

            // prepare template variables
            var templateData = {
                'url' : url,
                'totalRecs' : hunchData.total,
                'hunchRecs' : hunchData.recommendations
            }
            
            // render the template with templateData
            res.render("hunch_display.html",templateData)
        }
    });

});
// end of main page



// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});