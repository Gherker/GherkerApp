// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ATDD_Test');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var Feature     = require('./app/models/Feature');
var Suggestion     = require('./app/models/Suggestion');
var Setting =  require('./app/models/Setting');
var User =  require('./app/models/User');
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/gherkins', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


router.route('/addfeature')

    .post(function(req, res) {
        
        var feature1 = new Feature();      // create a new instance of the Bear model
        feature1.name = req.body.name;  // set the bears name (comes from the request)

        feature1.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });
        
    });

router.route('/getfeatures')  
    .get(function(req, res) {
        Feature.find(function(err, features) {
            if (err)
                res.send(err);
                
            res.json(features);
            //console.log(features);
        });
    });
    
router.route('/getfeatures/:feature_src_id')  
    .get(function(req, res) {
        console.log("getfeatures/"+ req.params.feature_src_id)
        Feature.find({ featureSourceID: req.params.feature_src_id }, function(err, features) {
            if (err)
                res.send(err);
                
            res.json(features);
            //console.log(features);
        });
    });

 router.route('/getsuggestions')  
        .get(function(req, res) {
            console.log("getsuggestions");
            Suggestion.find(function(err, suggestions) {
            if (err)
                res.send(err);
                
            res.json(suggestions);
            //console.log(suggestions);
        });
    });
 
router.route('/getsuggestions/:suggestion_src_id')  
    .get(function(req, res) {
        console.log("getsuggestions/" + req.params.suggestion_src_id);
        Suggestion.find({ AppID: req.params.suggestion_src_id }, function(err, features) {
            if (err)
                res.send(err);
                
            res.json(features);
            //console.log(features);
        });
    });
    
 router.route('/getappslist')  
    .get(function(req, res) {
        console.log("getappslist");
        var query = Suggestion.find({}).select({ "AppID": 1,"AppName":2, "_id": 0}).sort({ "AppID" : "asc"});
        
            query.exec(function (err, output) {
                if (err) return next(err);
                res.send(output);
            });
    });
    
    
 router.route('/getsettings')  
        .get(function(req, res) {
            console.log("getsettings");
            Setting.find(function(err, settings) {
            if (err)
                res.send(err);
                
            res.json(settings);
            //console.log(suggestions);
        });
        });

 router.route('/addsetting') 
        .post(function(req, res) {
            
            var nextSeq = 0;
            Setting.find(function(err, settings) {
                if (err)
                    res.send(err);
                    
                nextSeq = settings.length + 1;
                
                // create a new user
                var newSetting = Setting({
                appid: nextSeq,
                appname: req.body.appname,
                sourceType: req.body.sourceType,
                sourceUrl: req.body.sourceUrl, //'http://kdcptfsapp01.dqa.capitalone.com:8080/tfs/IRIS',
                sourcePath: req.body.sourcePath, // '$/QA/AutomatedFunctionalTests/Main/Tests/WorkFlows',
                username: req.body.username , //'A-KZU822',
                password: req.body.password,//'AQAAANCMnd8BFdERjHoAwE/Cl+sBAAAAFBdp0HidDUWVspe6tXGNjwAAAAACAAAAAAADZgAAwAAAABAAAADASzjGb1dmJVmlPPQ6RCXeAAAAAASAAACgAAAAEAAAACP0V20kqGxy82RSZy5vxq0YAAAAVWsRs3dyu09W6A7o4g2ETjPT4FELXUr/FAAAAMs/PbqmheLiugT9GfEeoT8YeHYX',
                userdomain: req.body.userdomain, //,
                created: Date()
                });
                
                // save the user
                newSetting.save(function(err) {
                if (err) throw err;
                
                console.log('User created!');
                res.json('00');
                });
                //console.log(suggestions);
            } );


        });
        
        
 router.route('/deletesetting/:app_id') 
        .delete(function(req, res) {
            Setting.remove({
            appid: req.params.app_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });


        });

router.route('/adduser') 
        .post(function(req, res) {
            var newUser = User({
                userid: req.body.userid,
                password: req.body.password,
                username: req.body.username,
                isadmin: req.body.isadmin, 
                oAuthkey: req.body.oAuthkey, 
                files: req.body.files , 
                created: Date()
                });
                
                // save the user
                newUser.save(function(err) {
                if (err) throw err;
                
                console.log('User created!');
                res.json('00');
                });

        });
        
router.route('/authenticate') 
        .post(function(req, res) {
              
            User.find({ userid: req.body.userid, password: req.body.password }, function(err, users) {
            if (err)
                res.send(err);
            
            if(users.length!=0 && !(users.length > 1)){
                res.json(users);
            }else{
                res.json('99')
            }
                
             

            });

        });


app.use(express.static(__dirname +"/public"));   
app.get('/public', function(req, res) {
        res.sendfile(__dirname + '/public/index.html'); 
    });
 

    
    
    
    
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);