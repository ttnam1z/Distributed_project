const WebSocket = require('ws');

// For all string can use
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

module.exports = (http,sequelize)=>{
  var usrcontrol = require('../controllers/userscontroller')

  // const server = new WebSocket.Server({
  //   port: 8080
  // });
  const server = new WebSocket.Server({ server:http });

  let sockets = [];

  function create_data(msg,data){
    return JSON.stringify({message:msg,
            data:data})
  }

  server.on('connection', async function(socket) {
    console.log('a user connected')
    // usrcontrol.test(sequelize)
    // data1 = await usrcontrol.getUsers(sequelize)
    // socket.send(create_data("test",data1))

    // When you receive a message, send that message to every socket.
    let userStatus = 0;

    async function userlogin(msg){
      console.log(msg)
      // Check exist name
      var name = msg.name
      var hashpass = msg.hashpass.hashCode()
      user = await usrcontrol.getUser(sequelize,name,hashpass)
      let res;
      if(user === null){
        res = create_data("login_res","Fail")
      } else{
        // Add user to observe
        res = create_data("login_res","OK")
        console.log('a user login success ' + msg.name)
        userStatus = 1;
        sockets.push({
          user:msg.name,
          socket:socket});
        console.log(sockets.length);
        
      }
      if(res.data == "Fail" && userStatus ==1){
        // Case current login then login again fail
        socket.close();
      }
      return res;
    }

    async function userregister(msg){
      if(userStatus ==1){
        // Case current login then register without logout
        socket.close();
        return create_data("register_res","Fail")
      }
      
      var name = msg.name
      var user = await usrcontrol.getUser(sequelize,name)
      let res;
      if(user === null){
        // create new user
        console.log("create new user")
        info = {name:msg.name,
                hashpass:msg.hashpass.hashCode()}
        user = await usrcontrol.createUser(sequelize,info)
        if(user === null){
          res = create_data("register_res","Fail")
        } else{
          res = create_data("register_res","OK")
        }
      } else{
        res = create_data("register_res","Fail")
      }
      return res;
    }

    async function processMsg(msg){
      switch(msg.message){
        case "chat":// relate to chat
            break;
          case "block":  // both setblock or unblock
            break;
          default:
      }
    }
    
    socket.on('message', async function(evt) {
      msg = JSON.parse(evt)
      
      // Handle valid
      let res;
      switch(msg.message){
        case "login": 
          socket.send(create_data("inform","doing"))
          res = await userlogin(msg.data)
          break;
        case "logout":
          // socket.close();
          userStatus = 0;
          sockets = sockets.filter(s => s.socket !== socket);
          res = create_data("logout_res","OK")
          break;
        case "register":
          socket.send(create_data("inform","doing"))
          res = await userregister(msg.data)
          break;
        default:
          // TODO check login status

          // pass to processMsg
          res = await processMsg(msg.data)
      }

      // console.log(msg.name)
      // let data = {name:msg.name}
      //sockets.forEach(s => s.send(JSON.stringify(data)));
      socket.send(res)
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', async function() {
      console.log("socket close")
      // console.log(socket)
      sockets = sockets.filter(s => s.socket !== socket);
    });
  });
  return {sockets: sockets,
          server: server}
}

/* // Using socket io
  var list_socket = [];
  
  //Connect to other server
  
  io.on('connection',socket =>{
    console.log('a user connected')
    
    socket.on('create or join',room =>{
      console.log('create or join to room',room)
      const myRoom = io.sockets.adapter.rooms.get(room) || new Set()
      const numClients = myRoom.size
      console.log(room, 'has', numClients, 'clients')
      if(numClients == 0){
        socket.join(room)
        console.log('check',io.sockets.adapter.rooms.get(room))
        socket.emit('created',room)
      } else if(numClients == 1){
        console.log('join fuck')
        socket.join(room)
        socket.emit('joined',room)
      } else {
        socket.emit('full',room)
      }
    })
  
  })*/