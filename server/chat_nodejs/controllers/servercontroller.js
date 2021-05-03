const WebSocket = require('ws');
// let conSockets = [];
// let revSockets = [];
let sersockets = [];
let server;
let sockets = [];
let ws_lis;
let serverConfig = require('../config/serverConfig'); // fake config
let usrcontrol = require('../controllers/userscontroller')
let glbusrcontrol = require('../controllers/userglbcontroller')
let msgscontrol = require('../controllers/msgscontroller')
let roomscontrol = require('../controllers/roomscontroller')
let blockcontrol = require('../controllers/blockcontroller')
let roomtimescontrol = require('../controllers/roomtimescontroller')
let gblList =[];
let othSerCli = [];


let test1 = [];
let test2 = 1;
let test3 = [];
let test4 = 4;

async function sendNotifyOtherServer(data){
  for (s of sersockets) {
    s.socket.send(data);
  }
}

async function sendNotifyOtherClient(data){
  for (s of sockets) {
    s.socket.send(data);
  }
}


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

function create_data(msg,data){
  return JSON.stringify({message:msg,
          data:data})
}

module.exports.initServer = async (sequelize)=>{
  //connect to server
  let server1 = 'ws://192.168.99.100:4569/';
  const ws = new WebSocket(server1);

  ws.on('open', async function open() {
    // Check identification
    ws.send('hashpassof(ipandpass)');
    // Handshake

    
    //ws.send('something');
  });

  ws.on('message', async function incoming(evt) {
    msg = JSON.parse(evt)
      
      // Handle valid
      let res;
      switch(msg.message){
        case "ack1": 
        // if ok
          if(msg.data == "OK"){
            console.log("ack1 ok")
            sersockets.push({
              serverId:serverConfig[1].id,
              socket:ws});
            console.log(sersockets.length);
          }
          break;
        case "update":
          
          break;
        default:
          // TODO check login status

          // pass to processMsg
          res = await processMsg(msg)
      }
  });

  
  ws.on('close', async function close() {
    console.log('connect to server 1 disconnected');
    sersockets = sersockets.filter(s => s.socket !== ws);
    othSerCli = othSerCli.filter(s => s.socket !== ws);

    // TODO set offline notify and update status of userlist
  });

  ws.on('error', async function handleError(err) {
    console.log('connect to server 1 errored');
    sersockets = sersockets.filter(s => s.socket !== ws);
    othSerCli = othSerCli.filter(s => s.socket !== ws);
  });

  //listen to wait for server that hasn't turned on.
  ws_lis = new WebSocket.Server({ port:4567 })
  ws_lis.on('connection', async function(socket) {
    console.log('connected to a server')
    // Check identification

    socket.on('message', async function(evt) {
      msg = JSON.parse(evt)
      
      // Handle valid
      let res;
      switch(msg.message){
        case "login": 
          socket.send(create_data("inform","doing"))
          res = await userlogin(msg.data)
          break;
        default:
          // TODO check login status

          // pass to processMsg
          res = await processMsg(msg)
      }

    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', async function() {
      console.log("socket close")
      // console.log(socket)
      sersockets = sersockets.filter(s => s.socket !== socket);
      othSerCli = othSerCli.filter(s => s.socket !== socket);
    });
    socket.on('error', async function(err) {
      console.log("socket error")
      // console.log(socket)
      sersockets = sersockets.filter(s => s.socket !== socket);
      othSerCli = othSerCli.filter(s => s.socket !== socket);
    });

  });
  
  return {
    sersockets:sersockets,
    server_lis: ws_lis
  }
};

module.exports.initClientLis = async (http,sequelize)=>{
  var glbdata = await glbusrcontrol.getUsers(sequelize);
  glbdata.forEach(element => {
    element.dataValues.status = 0;
    gblList.push(element.dataValues);
  });

  // var gbllen = gblList.length
  // while(gbllen--){
  //     gblList[gbllen].dataValues.status = 0;
  // };
  console.log(gblList)

  // const server = new WebSocket.Server({
  //   port: 8080
  // });
  server = new WebSocket.Server({ server:http });
  server.on('connection', async function(socket) {
    var glbExtraInfo = [];

    console.log('a user connected')
    // usrcontrol.test(sequelize)
    // data1 = await usrcontrol.getUsers(sequelize)
    // socket.send(create_data("test",data1))

    // When you receive a message, send that message to every socket.
    let userStatus = 0;
    let usergblId;
    let friendinfo;
    let roomId;

    function clearVariable(){
    userStatus = 0;
    usergblId = -1;
    friendinfo = null;
    roomId = -1;
    }

    async function userlogin(msg){
      //console.log(msg)
      // Check exist name
      var name = msg.name
      var hashpass = msg.hashpass.hashCode()
      user = await usrcontrol.getUser(sequelize,name,hashpass)
      var res, result='Fail';
      if(user === null){
        res = create_data("login_res",{type:"result",result:result})
        
      } else{
        // Get global user
        clearVariable();
        var glbuser = await glbusrcontrol.getUser(sequelize,name,serverConfig[0].id)    
        usergblId = glbuser.globalId;
        console.log('a user login success ' + msg.name)
        userStatus = 1;
        var arrlen = gblList.length
        while(arrlen--){
          if (gblList[arrlen].globalId === glbuser.globalId){
            gblList[arrlen].status = 1;
            break;
          }
        };

        // Send current globalId
        socket.send(create_data("login_res",{type:"globalId",result:glbuser.globalId}))

        // Send list of user
        socket.send(create_data("login_res",{type:"userList",result:gblList}))

        // TODO Send block and message status
        var blocklist = await blockcontrol.getBlockUsers(sequelize,{user:usergblId})
        console.log("blocklist ")
        console.log(blocklist)
        glbExtraInfo = [];
        gblList.forEach(ele=>{
          var extrainfo = {block:0,msg:0}
          var exist = false;
          if (blocklist !== undefined & blocklist !== null){
            for (blk of blocklist){
              console.log(blk.blockedUser)
              console.log(ele.globalId)
              if (blk.blockedUser == ele.globalId){
                exist = true;
              }
            }
          }
          
          if(exist){
            extrainfo.block = 1; 
          }

          // TODO get message status
          exist = false
          glbExtraInfo.push(extrainfo)
          
        })
        socket.send(create_data("login_res",{type:"extraInfo",result:glbExtraInfo}))

        

        // Add user to observe
        sockets.push({
          user:glbuser.globalId,
          socket:socket});
        console.log("sockets lengh", sockets.length);
        
        // send notify to other user
        sendNotifyOtherClient(create_data("userOnline",{name:glbuser.name,globalId:glbuser.globalId})).catch(err=>{
          console.log(err)
        });

        // TODO send notify to other server
        sendNotifyOtherServer(create_data("userOnline",{name:glbuser.name,userId:glbuser.userId})).catch(err=>{
          console.log(err)
        });
        result = "OK"
        res = create_data("login_res",{type:"result",result:result})
      }
      
      if(result == "Fail" && userStatus ==1){
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
          // create global user
          info = { name: user.name, serverId: serverConfig[0].id, userId:user.id}
          console.log("user id")
          console.log(user.id)
          glbuser = await glbusrcontrol.createUser(sequelize,info)
          if(glbuser === null){
            usrcontrol.deleteUser(user.id);
            res = create_data("register_res","Fail")
          }else{
            res = create_data("register_res","OK")
            
            // add to global list
            gblList.push({name:glbuser.name,userId:glbuser.userId,globalId:glbuser.globalId,
              status:0,serverId:glbuser.serverId})

            // send notify to other user
            sendNotifyOtherClient(create_data("newuser",{name:glbuser.name,globalId:glbuser.globalId})).catch(err=>{
              console.log(err)
            });

            // TODO inform other server
            sendNotifyOtherServer(create_data("newuser",{name:glbuser.name,userId:glbuser.userId})).catch(err=>{
              console.log(err)
            });
          }
          
        }
      } else{
        res = create_data("register_res","Fail")
      }
      return res;
    }

    async function processChat(msg){
      var res = {}
      switch(msg.type) {
        case "joinRoom":
          // create room if not exist
          friendinfo = await glbusrcontrol.getUser(sequelize,"any","any",msg.friendId)
          if (friendinfo === null){
            console.log("join room fail get friend data")
              socket.send(create_data("chat_res",{type:"joinroom_res",result:"Fail"}))
              break;
          }
          
          var id = [usergblId,friendinfo.globalId].sort();
          console.log(id)
          var room = await roomscontrol.getRoom(sequelize,{idlist:id})
          if(room === null){
            room= await roomscontrol.createRoom(sequelize,{idlist:id})
            if (room === null){
              console.log("join room fail")
              socket.send(create_data("chat_res",{type:"joinroom_res",result:"Fail"}))
              break;
            } else {
              socket.send(create_data("chat_res",{type:"joinroom_res",result:"OK"}))
            }
          }

          // TODO Load list of message
          console.log("room id")
          console.log(room.id)
          roomId = room.id
          var msgs = await msgscontrol.getMessages(sequelize,{roomId:roomId})
          
          // Send list of message
          if (msgs != null){
            socket.send(create_data("chat_res",{type:"msgList",result:msgs}))
          }
          break;
        case "message": //TODO
          if(roomId == -1){
            socket.send(create_data("chat_res",{type:"message_res",result:"3"}))
            break;
          }
          var timeStamp = new Date()
          // Store in db
          var info = { 
            roomId:roomId, 
            userGlobal:usergblId,
            content:msg.content,
            timeStamp:timeStamp}
          var msg = await msgscontrol.createMessage(sequelize,info)
          // Send message to friend
          // Check friend server id
          // Check block
          if(msg === null){
            socket.send(create_data("chat_res",{type:"message_res",result:"2"}))
          } else{
            socket.send(create_data("chat_res",{type:"message_res",result:"OK"}))
          }
          var block_info = await blockcontrol.getBlockUser(sequelize,{
            user:friendinfo.globalId,
            blockedUser:usergblId
          })
          if(block_info != null){
            console.log("friend is blocking")
            console.log(block_info)
            // Friend is blocking
            // Dont send msg
            break;
          }

          if(friendinfo.serverId == serverConfig[0].id){
            var arrlen = sockets.length
            while(arrlen--){
              if (sockets[arrlen].user == friendinfo.globalId){
                console.log("send msg to other client")
                console.log(friendinfo.name)
                sockets[arrlen].socket.send(create_data("chatMsg",msg))
                break;
                }
              }
           } else{
             console.log("send msg to other server")
            var arrlen = sersockets.length
            while(arrlen--){
              if(sersockets[arrlen].serverId == friendinfo.serverId){
                sersockets[arrlen].socket.send(create_data("chat",{type:"tfMsg",result:msg}))
              }
            }
           }
          break;
        case "outRoom":
          // clear room variable
          roomId = -1
          friendinfo = null
          break;
        default:
      }
      res = create_data("chat_res",{type:"info",result:"Done process"})
      return res;
    }

    async function processMsg(msg){
      var res = {};
      switch(msg.message){
        case "chat":// relate to chat
            res = await processChat(msg.data)
            break;
          case "blockmsg":  // both setblock or unblock
            var blockstatus = 0;
            res = {result:"OK"}
            console.log(msg.data.block)
            if(msg.data.block == 1){
              var crt = new Date()//.toLocaleString("sv-SE");
              console.log(crt)
              var blocklist = await blockcontrol.blockUser(sequelize,{user:usergblId, blockedUser:msg.data.userId,timeStart:crt})
              if(blocklist !== null){
                blockstatus = 1;
              } else {
                res = {result:"Fail"}
              }
            } else{
              await blockcontrol.unblockUser(sequelize,{user:usergblId, blockedUser:msg.data.userId})
            }

            var arrlen = gblList.length
            while(arrlen--){
              if (gblList[arrlen].globalId == usergblId){
                glbExtraInfo[arrlen].block = blockstatus;
                break;
              }
            };
            res = create_data("block_res",res)
            break;
          default:
      }
      return res;
    }
    
    socket.on('message', async function(evt) {
      msg = JSON.parse(evt)
      console.log("receive message from client")
      console.log(msg.message)
      console.log(msg.data)
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
          var arrlen = gblList.length
          while(arrlen--){
            if (gblList[arrlen].globalId == usergblId){
              gblList[arrlen].status = 0;
              break;
            }
          };
          sockets = sockets.filter(s => s.socket !== socket);

          // send off notify to other user
          sendNotifyOtherClient(create_data("userOff",{name:gblList[arrlen].name,globalId:gblList[arrlen].globalId})).catch(err=>{
            console.log(err)
          });

          // TODO inform off other server
          sendNotifyOtherServer(create_data("userOff",{name:gblList[arrlen].name,userId:gblList[arrlen].userId})).catch(err=>{
            console.log(err)
          });

          res = create_data("logout_res","OK")
          break;
        case "register":
          socket.send(create_data("inform","doing"))
          res = await userregister(msg.data)
          break;
        default:
          // TODO check login status

          // pass to processMsg
          res = await processMsg(msg)
      }

      // console.log(msg.name)
      // let data = {name:msg.name}
      //sockets.forEach(s => s.send(JSON.stringify(data)));
      socket.send(res)
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', async function() {
      console.log("socket close")

      // update status of userlist
      var arrlen = gblList.length
      while(arrlen--){
        if (gblList[arrlen].globalId === usergblId){
          gblList[arrlen].status = 0;
          break;
        }
      };

      // console.log(socket)
      sockets = sockets.filter(s => s.socket !== socket);

      // send off notify to other user
      sendNotifyOtherClient(create_data("userOff",{name:gblList[arrlen].name,globalId:gblList[arrlen].globalId})).catch(err=>{
        console.log(err)
      });

      // TODO inform off other server
      sendNotifyOtherServer(create_data("userOff",{name:gblList[arrlen].name,userId:gblList[arrlen].userId})).catch(err=>{
        console.log(err)
      });
    });
    socket.on('error', async function(err) {
      console.log("socket close")
      // console.log(socket)
      sockets = sockets.filter(s => s.socket !== socket);
    });
  });


  return {
    sockets: sockets,
    server:server
  }
};

module.exports.testt1 = ()=>{
  test1.push({a:"hello"});
  test2 = 4;
};

module.exports.testt2 = ()=>{
  test3.push({a:"hello 3"});
  test4 = 5;;
};

module.exports.testt3 = ()=>{
  console.log(test1);
  console.log(test2);
  console.log(test3);
  console.log(test4);
};