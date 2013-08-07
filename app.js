var http = require("http"),
    express = require ("express"),
    async = require ("async"),
    app = express(),
    mongoose = require("mongoose"),
    api = require('./controller/api');

//Including All controllers
var UserControl=require('./controller/UserController');
var HomeControl=require('./controller/HomeController');

//Setting App Values
var store = new express.session.MemoryStore;
app.use(express.cookieParser("thissecretrocks"))
app.use(express.session({ secret: 'whatever', store: store }));
app.use(express.bodyParser({keepExtensions: true, uploadDir: __dirname + "/public/uploads"}));
app.set('view engine', 'ejs');
app.set('views',__dirname+'/public/view');
app.use(express.static(__dirname + '/public'));

//Initializing Mongoose
mongoose.connect( 'mongodb://localhost/nodehiring',function(err){
    if (err)
    console.log('Error while connecting to mongodb');
    else
    console.log('Connected To Mongo Database');
});

app.listen(8080);
console.log('Server Has Started at '+ new Date())

//Initialize admin data
api.initDB();

//Request Handler
app.get('/',HomeControl.showPage);
app.post('/ApplyNow',api.createUser);
app.post('/login',api.loginUser);
app.get('/logout',api.logoutUser);
app.post('/forgotPassword',api.forgotPassword);
app.post('/activate',api.activateUser);
app.post('/activateUser',api.getActivateUser);
app.get('/checkUserSession',api.checkUserSession);

