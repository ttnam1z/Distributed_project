
// Connect database
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
var sequelize = require('./config/dbConfig')
var express = require('express')
var app = express()
var path = require('path')
// var cookieParser = require('cookie-parser')
// var cookieValidator = require('./cookieValidator')


let http = require('http').Server(app)
var port = process.env.PORT || 8080

//Create websocket connect to other server
var SocketHdl = require("./controllers/servercontroller");
SocketHdl.initServer(sequelize);

// Create websocket listen to http server
// var websocket = require("./config/wsConfig")(http,sequelize);
setTimeout(function() {SocketHdl.initClientLis(http,sequelize)}, 6000);
// SocketHdl.testt3();
// SocketHdl.testt1();
// SocketHdl.testt3();
// SocketHdl.testt2();
// SocketHdl.testt3();


// console.log(__dirname)
//Use middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//Serves all the request which includes /images in the url from Images folder
// app.use('/images', express.static(__dirname + '/Images'));

// async function validateCookies (req, res, next) {
//   await cookieValidator(req.cookies)
//   next()
// }

// app.use(cookieParser())
// app.use(validateCookies)

// error handler
app.use(function (err, req, res, next) {
  res.status(400).send(err.message)
})
// let io = require('socket.io')(http)



/* // Using mysql
var mysql = require('mysql');
let mysql_con = mysql.createConnection({
  host: '192.168.99.100',
  user: 'nam',
  password: 'nam_pass',
  database: 'distributed_project',
  port: 3306
});
mysql_con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});*/




// setTimeout(function() {//Test write data
//   var usrcontrol = require('./controllers/userscontroller')
//   usrcontrol.test(User)
// }, 3000);


http.listen(port,()=>{
  console.log('listen on',port)
})