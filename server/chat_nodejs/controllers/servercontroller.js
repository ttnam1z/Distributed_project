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
let usernotifyscontrol = require('../controllers/usernotifyscontroller')
let gblList =[];
let othSerCli = [];
let gblList_load= false;

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

  async function Handshake(evt){
    sersocket = sersockets[0].socket;
    // send list user
    //var user_info = await glbusrcontrol.getUsers(sequelize);
    //sersocket.send(create_data("Handshake_data",{message:"usersinfo",data:user_info}));

    // send user status
    sersocket.send(create_data("Handshake_data",{message:'status_info',data:gblList}));

    // send user blocking
    //var block_info = blockcontrol.getAllBlocks()
    //sersocket.send(create_data("Handshake_data",{message:'blockinfo',data:block_info}));

    // send user message notification
    //var noti_info = await usernotifyscontrol.getAllNotifys(sequelize);
    //sersocket.send(create_data("Handshake_data",{message:'noti_info',data:noti_info}));
  
    // send server notification
    //var ser_noti
    //sersocket.send(create_data("Handshake_data",{message:'ser_noti',data:ser_noti}));

  }

  async function Handle_Handshakemsg(msg){
    
    let res;
    switch(msg.message){
      case "usersinfo":
        // receive list user
        user_info = msg.data

        //find different user
        //var user_info_lo = await glbusrcontrol.getUsers(sequelize);

        //add global user
        break;
      case "status_info":
        // receive user status
        user_status = msg.data
        if(!gblList_load){
          gblList_load = true
          var glbdata = await glbusrcontrol.getUsers(sequelize);
            glbdata.forEach(element => {
            element.dataValues.status = 0;
            gblList.push(element.dataValues);
          });
        }
        console.log(gblList)
        msg.data.forEach(element=>{
          var arrlen = gblList.length
          while(arrlen--){
            if (gblList[arrlen].globalId === element.globalId && element.status == 1){
              gblList[arrlen].status = 1;
              gblList[arrlen].server_log_Id = 2; // log in other server
              break;
            }
          };
        })
        console.log("after")
        console.log(gblList)
        // find different user status

        // add user status

        // check gblList for conflict (loaded glbList or not)
        break;
      case "blockinfo":
        // receive user blocking
        block_info = msg.data

        // find different user blocking

        // add user blocking

        // check gblList for conflict (loaded glbList or not)
        break;
      case "noti_info":
        // receive user message notification
        noti_info = msg.data

        // find different user notification

        // add user notification

        // check gblList for conflict (loaded glbList or not)
        break;
      case "ser_noti": // use for synchonize message database
          // receive server message notification
          ser_noti = msg.data
  
          // find different server notification
  
          // store message
  
          break;
      default:
    }
    
  }

  async function ser_newuser(msg){
    // create global user 
    //glbuser = await glbusrcontrol.createUser(sequelize,info)
    data = msg
    // add to global list
    gblList.push({name:data.name,userId:data.userId,globalId:data.globalId,
      status:0,serverId:1}); // if using same database, serverid is 1

    
    // send notify to other local user
    sendNotifyOtherClient(create_data("newuser",{name:data.name,globalId:data.globalId})).catch(err=>{
        console.log(err)
    });
  }

  async function ser_userOnline(msg){
    data = msg
    // update global user list
    var arrlen = gblList.length
    while(arrlen--){
      if (gblList[arrlen].globalId === data.globalId){
        gblList[arrlen].status = 1;
        gblList[arrlen].server_log_Id = 2; // log in other server
        break;
      }
    };
    
    // send notify to other local user
    sendNotifyOtherClient(create_data("userOnline",{name:data.name,globalId:data.globalId})).catch(err=>{
        console.log(err)
    });
  }

  async function ser_userOff(msg){
    data = msg
    //Update global user list
    var arrlen = gblList.length
    while(arrlen--){
      if (gblList[arrlen].globalId == data.globalId){
        gblList[arrlen].status = 0;
        gblList[arrlen].server_log_Id = 0;
        break;
      }
    };
    
    // send notify to other local user
    sendNotifyOtherClient(create_data("userOff",{name:data.name,globalId:data.globalId})).catch(err=>{
        console.log(err)
    });
  }

  async function ser_chat(msg){
    data = msg

    var arrlen = sockets.length
    while(arrlen--){
      if (sockets[arrlen].user == msg.globalId){ // found socket so is connecting to this server
        console.log("send msg to other client")
        console.log(msg.name)
        found = true;
        sockets[arrlen].socket.send(create_data("chatMsg",msg.msg))
        break;
      }
    }
  }

  async function ser_processMsg(msg){
    let res;
    switch(msg.message){
      case "newuser":
        ser_newuser(msg.data);
        break;
      case "userOnline":
        ser_userOnline(msg.data);
        break;
      case "userOff":
        ser_userOff(msg.data);
        break;
      case "chat_msg":
        ser_chat(msg.data);
        break;
      default:
    }
  }

  /*
  //connect to server
  let server1 = 'ws://10.7.11.200:4567/';
  const ws = new WebSocket(server1);

  ws.on('open', async function open() {
    console.log("server connect 1")
    // Check identification
    ws.send(create_data("Handshake",'Start'));
    // Handshake
    Handshake();

    //ws.send(create_data("Handshake","End"));

    
    //ws.send('something');
  });

  ws.on('message', async function incoming(evt) {
    msg = JSON.parse(evt)
    console.log(msg);
      
      // Handle valid
      let res;
      switch(msg.message){
        case "Handshake": 
        // if ok
          if(msg.data == "Start"){
            console.log("start handshake")
            sersockets.push({
              serverId:serverConfig[1].id,
              socket:ws});
            console.log(sersockets.length);
          }
          break;
        case "Handshake_data":
          res = Handle_Handshakemsg(msg.data);
          break;
        default:
          // pass to processMsg
          res = await ser_processMsg(msg)
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
  */

  //listen to wait for server that hasn't turned on.
  ws_lis = new WebSocket.Server({ port:4567 })
  ws_lis.on('connection', async function(socket) {
    console.log('connected to a server')
    // Check identification
    socket.send(create_data("Handshake",'Start'));

    socket.on('message', async function(evt) {
      console.log("receive message from server")
      msg = JSON.parse(evt)
      console.log(msg)
      // Handle valid
      let res;
      switch(msg.message){
        case "Handshake": 
        // if ok
          if(msg.data == "Start"){
            console.log("start handshake")
            sersockets.push({
              serverId:serverConfig[1].id,
              socket:socket});
            console.log(sersockets.length);
          }
          // Handshake same database so dont need
          Handshake();
          break;
        case "Handshake_data":
          res = Handle_Handshakemsg(msg.data);
          break;
        default:
          // TODO check login status

          // pass to processMsg
          res = await ser_processMsg(msg)
      }

    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', async function() {
      console.log("server socket close")
      // console.log(socket)
      sersockets = sersockets.filter(s => s.socket !== socket);
      othSerCli = othSerCli.filter(s => s.socket !== socket);
      // set offline for all user of that server
      var arrlen = gblList.length
      while(arrlen--){
        if (gblList[arrlen].server_log_Id == 2 && gblList[arrlen].status == 1){
          gblList[arrlen].status = 0
          gblList[arrlen].server_log_Id == 0
          // send notify to other local user
          sendNotifyOtherClient(create_data("userOff",{name:gblList[arrlen].name,globalId:gblList[arrlen].globalId})).catch(err=>{
            console.log(err)
          });
        }
      };
    });

    socket.on('error', async function(err) {
      console.log("server socket error")
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
  if(!gblList_load){
    gblList_load = true
    var glbdata = await glbusrcontrol.getUsers(sequelize);
      glbdata.forEach(element => {
      element.dataValues.status = 0;
      gblList.push(element.dataValues);
    });
  }

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
      // user = await usrcontrol.getUser(sequelize,name,hashpass)
      user = await glbusrcontrol.getUser_hass(sequelize,name,hashpass)
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
            if(gblList[arrlen].status === 1){
              // check already login
              res = create_data("login_res",{type:"result",result:result})
              return res;
            }
            gblList[arrlen].status = 1;
            gblList[arrlen].server_log_Id = 1;
            break;
          }
        };

        // Send current globalId
        socket.send(create_data("login_res",{type:"globalId",result:glbuser.globalId}))

        // Send list of user
        socket.send(create_data("login_res",{type:"userList",result:gblList}))

        // TODO Send block and message status
        var userNotilist = await usernotifyscontrol.getUserNotifys(sequelize,{user:usergblId,type:1})

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
                break;
              }
            }
          }
          
          if(exist){
            extrainfo.block = 1;
            extrainfo.msg = 0;
          } else{
            exist = false;
            // Find room time lefl
            for(rt of userNotilist){
              if(rt.info == ele.globalId){
                exist = true;
                break;
              }
            }
            if(exist){
              extrainfo.msg = 1;
            }
          }

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
        sendNotifyOtherServer(create_data("userOnline",{name:glbuser.name,globalId:glbuser.globalId})).catch(err=>{
          console.log(err)
        });
        result = "OK"
        res = create_data("login_res",{type:"result",result:result})
      }
      
      //if(result == "Fail" && userStatus ==1){
      //  // Case current login then login again fail
      //  socket.close();
      //}
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
          info = { name: user.name, serverId: serverConfig[0].id, userId:user.id, hashpass:user.hashpass}
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
            // gblList.push({name:glbuser.name,userId:glbuser.userId,globalId:glbuser.globalId,
            //     status:0})

            // send notify to other user
            sendNotifyOtherClient(create_data("newuser",{name:glbuser.name,globalId:glbuser.globalId})).catch(err=>{
              console.log(err)
            });

            // TODO inform other server
            sendNotifyOtherServer(create_data("newuser",{name:glbuser.name,globalId:glbuser.globalId})).catch(err=>{
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
          // friendinfo = await glbusrcontrol.getUser(sequelize,"any","any",msg.friendId)
          var arrlen = gblList.length
          friendinfo = null
          while(arrlen--){
            if (gblList[arrlen].globalId == msg.friendId){
              friendinfo = gblList[arrlen];
              break;
            }
          };
          
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
            }
          }

          socket.send(create_data("chat_res",{type:"joinroom_res",result:"OK"}))
          // Clear notify
          console.log("usernotiy get")
          var usernoti = await usernotifyscontrol.getUserNotify(sequelize,{
            info:friendinfo.globalId,
            type:1,
            user:usergblId
          })

          if(usernoti != null){
            console.log(usernoti)
            console.log("delete usernotify")
            usernoti = await usernotifyscontrol.deleteUserNotify(sequelize,{
              info:friendinfo.globalId,
              type:1,
              user:usergblId
            })
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
            // Find status and connect server, checked by client socket connecting
            // if(friendinfo.server_log_Id == serverConfig[0].id && friendinfo.status == 1){

            // Check notify if have
            var usernoti = await usernotifyscontrol.getUserNotify(sequelize,{
              info:usergblId,
              type:1,
              user:friendinfo.globalId
            })
            var block_info = await blockcontrol.getBlockUser(sequelize,{
              user:friendinfo.globalId,
              blockedUser:usergblId
            })
            if(block_info != null){
              console.log("friend is blocking")
              console.log(block_info)
              // Friend is blocking
              // Dont send msg create notice
              if(usernoti == null){
                usernoti = await usernotifyscontrol.createUserNotify(sequelize,{
                    info:usergblId,
                    type:1,
                    user:friendinfo.globalId
                })
              }
            } else {
              if(usernoti == null){
                var found = false;
                var arrlen = sockets.length
                while(arrlen--){
                  if (sockets[arrlen].user == friendinfo.globalId){ // found socket so is connecting to this server
                    console.log("send msg to other client")
                    console.log(friendinfo.name)
                    found = true;
                    sockets[arrlen].socket.send(create_data("chatMsg",msg))
                    break;
                  }
                }
                if(!found && friendinfo.status != 1){
                  // Create notify when not have and unconnected
                  usernoti = await usernotifyscontrol.createUserNotify(sequelize,{
                        info:usergblId,
                        type:1,
                        user:friendinfo.globalId
                    })
                }
              }
            }
             console.log(usernoti == null)
             console.log(block_info == null)
             console.log(friendinfo.server_log_Id != serverConfig[0].id)
             console.log( friendinfo.status == 1)

            if(usernoti == null && block_info == null && friendinfo.server_log_Id != serverConfig[0].id && friendinfo.status == 1){
              console.log("send msg to other server")
              var arrlen = sersockets.length
              var found = false;
              while(arrlen--){
                if(sersockets[arrlen].serverId == friendinfo.server_log_Id){
                  found = true;
                  sersockets[arrlen].socket.send(create_data("chat_msg",{type:"tfMsg",name:friendinfo.name, globalId:friendinfo.globalId,msg:msg}))
                }
                if(!found){
                  //TODO if server offline. then store and update when online
                  // Dont need if same database
                }
              }
            }
            

            socket.send(create_data("chat_res",{type:"message_res",result:"OK"}))
          }
          
          break;
        case "outRoom":
          // clear room variable
          roomId = -1
          friendinfo = null
          socket.send(create_data("chat_res",{type:"outroom_res",result:"OK"}))
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
            // Check notify if have
            var usernoti = await usernotifyscontrol.getUserNotify(sequelize,{
              info:msg.data.userId,
              type:1,
              user:usergblId
            })
            if(usernoti != null){
              socket.send(create_data("userNotify",{user:msg.data.userId}))
            }

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
        case "UserNotify":
          await usernotifyscontrol.createUserNotify(sequelize,{
              info:msg.data.info,
              type:1,
              user:msg.data.user
          })
          res = create_data("UserNotify_res",{result:"OK"})
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
          sendNotifyOtherServer(create_data("userOff",{name:gblList[arrlen].name,globalId:gblList[arrlen].globalId})).catch(err=>{
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
      if(userStatus ==1){
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
        sendNotifyOtherServer(create_data("userOff",{name:gblList[arrlen].name,globalId:gblList[arrlen].globalId})).catch(err=>{
          console.log(err)
        });
      }
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