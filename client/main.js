let input_user_reg = document.getElementById("user_reg");
let input_pass_reg = document.getElementById("pass_reg");
let input_user_log = document.getElementById("user_log");
let input_pass_log = document.getElementById("pass_log");
let mainscreen = document.getElementById("mainscreen");
let notice = document.getElementById("infor");
let modeluser = document.getElementById("modeluser");
let userdisplay = document.getElementById("userlist");
let chatdisplay = document.getElementById("chatfield")
let pass;
let glbuserId;
let UserList;
let friendId=-1;
let MsgList;

function clearVarialbe(){
  chatdisplay.innerHTML = ""
  glbuserId=-1;
  UserList=null;
  friendId=-1;
  MsgList = null;
}

function show_notice(msg){
  notice.lastElementChild.lastChild.textContent = msg;
  notice.style.display = 'block';
  notice.focus();
}

function parse_msg(msg){
  data = JSON.parse(msg.data)
  return data
}

function create_data(msg,data){
  return JSON.stringify({message:msg,
          data:data})
} 

$(document).ready(function onLoad(){
  var wsUri="ws://192.168.99.100:8000/"
  websocket = new WebSocket(wsUri); 
  websocket.onopen=function (evt){onOpen(evt)};
  websocket.onclose=function (evt){onClose(evt)};
  websocket.onmessage=function (evt){onMessage(evt)};
  websocket.onerror=function (evt){onError(evt)};
  //onMainDev();
})

// const socket = io("192.168.99.100:8000");
  
// socket.on('loginResponse',()=>{

// })

// socket.on('register',()=>{

// })

// socket.on('response',data=>{
  
// })

// socket.on('test',data=>{
//   console.log(data)
// })


if(window.WebSocket == undefined){
  console.log("not support websocket");
}




function onOpen(evt){
  // console.log("open websocket ok")
  // data = {name:'something'}
  // websocket.send(JSON.stringify(data));
}
function onClose(evt){
  console.log("close the socket");
  websocket = null;
}

function onError(evt){
  console.log("socket error");
  websocket = null;
}

function updateUseList(listuser){
  //Clear listuser
  userdisplay.innerHTML = ''
  var arrlen = listuser.length
  var idx = 0;
  while(arrlen--){
    //listuser[arrlen].block = 0 //fake code
    //listuser[arrlen].msg = 0 //fake code

    if (listuser[arrlen].globalId !==glbuserId){
      elemt = modeluser.cloneNode(true);
      elemt.addEventListener("click", onUserDifineClick, false);
      elemt.setAttribute("pos",arrlen+"");
      if(listuser[arrlen].status == 1){
        elemt.children[0].src='./images/bullet_green.png'
      }
      if(listuser[arrlen].block == 1){
        elemt.children[2].src='./images/block.png'
      }
      if(listuser[arrlen].msg == 1){
        elemt.children[3].src='./images/error.png'
      }
      elemt.children[1].textContent = listuser[arrlen].name
      userdisplay.appendChild(elemt);
      elemt.style.display='flex';
      listuser[arrlen].viewpos=idx;
      idx++;
    }
  };

}

function processLoginRes(msg){
  if(msg.type == "result" ){
    if (msg.result =='OK'){
      // Change to main screen
      document.getElementById("main_name").innerHTML = input_user_log.value
      mainscreen.style.display = 'block';
      document.getElementById("loginform").style.display = 'none'
      document.getElementById("registerform").style.display = 'none'
    } else {
      // show notify 
      show_notice("login fail");
    }
  } else if (msg.type == "globalId"){
    // Clear global varable
    clearVarialbe();
    glbuserId = msg.result;
  } else if (msg.type == "userList"){
    UserList = msg.result
  } else if (msg.type == "extraInfo"){
    // TODO update UserList
    extraInfo = msg.result
    var arrlen = extraInfo.length
    while(arrlen--){
      UserList[arrlen].block = extraInfo[arrlen].block;
      UserList[arrlen].msg = extraInfo[arrlen].msg;
    }
    updateUseList(UserList);
  }
}

function processRegisterRes(msg){
  if(msg == "OK"){
    input_user_log.value = input_user_reg.value;
    // send login detail
    data = {
      name:input_user_reg.value,
      hashpass:pass
    }
    websocket.send(create_data("login",data));
  } else {
    // show notify 
    show_notice("register fail");
  }
}

function processuserStatus(user,status){
  var name = user.name
  var globalId = user.globalId
  if (globalId !== glbuserId){
    // find in list
    var arrlen = UserList.length
    while(arrlen--){
      if(UserList[arrlen].globalId == globalId){
        var pos = UserList[arrlen].viewpos;
        UserList[arrlen].status = status;
        
        s = userdisplay.children[pos]
        if(UserList[arrlen].status == 1){
          s.children[0].src='./images/bullet_green.png'
        } else {
          s.children[0].src='./images/bullet_white.png'
        }

        if(UserList[arrlen].block == 1){
          s.children[2].src='./images/block.png'
        } else {
          s.children[2].src='./images/white.png'
        }
        if(UserList[arrlen].msg == 1){
          s.children[3].src='./images/error.png'
        } else {
          s.children[3].src='./images/white.png'
        }
        break;
      }
    }
  }
   
}

function processNewUser(user){
  // add user to list
  ele = {name:user.name,userId:-1,globalId:user.globalId,
    status:0,block:0,msg:0,serverId:-1,viewpos:userdisplay.childElementCount};
  elemt = modeluser.cloneNode(true);
  elemt.addEventListener("click", onUserDifineClick, false);
  elemt.setAttribute("pos",UserList.length+"");
  UserList.push(ele);
  elemt.children[1].textContent = ele.name

  userdisplay.appendChild(elemt);
  elemt.style.display='flex';
}

function processChatMsg(msg){
  // TODO check if current chatting

  // TODO update notify

  // update chatfield
  var item = document.createElement("li")
  item.className="frd"
  item.innerText = msg.content
  chatdisplay.appendChild(item)
  chatdisplay.scrollTop = chatdisplay.scrollHeight
}

function processAllNotice(data){
  switch(data.message){
    case "userOnline":
      processuserStatus(data.data,1);
      break;
    case "userOff":
      processuserStatus(data.data,0);
        break;
    case "newuser":
      processNewUser(data.data);
      break;
    case "chatMsg":
      processChatMsg(data.data);
      break;
    default:
      
  }
}

function updateMsgList(msgList){
  chatdisplay.innerHTML = ""
  var arrlen = msgList.length
  for(var i=0;i<arrlen;i++){
    var item = document.createElement("li");
    item.innerText=msgList[i].content
    if (msgList[i].userGlobal == glbuserId){
      item.className = "me"
    } else {
      item.className = "frd"
    }
    chatdisplay.appendChild(item)
  }
  chatdisplay.scrollTop = chatdisplay.scrollHeight

}

function processChatRes(msg){
  switch(msg.type){
    case "joinroom_res":
      // TODO show error if Fail
      break;
    case "msgList":
      // Todo show message in list
      typeof msg.result;
      MsgList = msg.result.sort(function(a,b){
        return (a.timeStamp < b.timeStamp)? -1 : 1;
      })
      // Check block
      if(UserList[friendId].block == 0){
        //Load message
        updateMsgList(MsgList);
      }
      break;
    case "message_res":
      if(msg.result == "OK"){
        var item = document.createElement("li");
        var message = document.getElementById("messagesend");
        item.innerText=message.value
        item.className = "me"
        chatdisplay.appendChild(item)
        message.value = ""
        chatdisplay.scrollTop = chatdisplay.scrollHeight
      } else {
        // TODO send problem, show notice
      }
    default:
  }
}

function onMessage(evt){
  console.log("receive message")
  data = JSON.parse(evt.data)
  console.log(data.message)
  console.log(data.data)
  switch(data.message){
    case "login_res":
      processLoginRes(data.data);
      break;
    case "register_res":
      processRegisterRes(data.data);
      break;
    case "chat_res":
      processChatRes(data.data);
      break;
    default:
      processAllNotice(data);
  }
}


function onLogout(){
  if(websocket !== null & websocket !== undefined){
    websocket.send(create_data("logout","OK"));
  }
  mainscreen.style.display = 'none';
  document.getElementById("loginform").style.display = 'block'
}

function onLogin(){
  //pass = input_pass_log.value
  //input_pass_log.value = ""
  if(websocket ==null){
    var wsUri="ws://192.168.99.100:8000/"
    websocket = new WebSocket(wsUri); 
    websocket.onopen=function (evt){onOpen(evt)};
    websocket.onclose=function (evt){onClose(evt)};
    websocket.onmessage=function (evt){onMessage(evt)};
    websocket.onerror=function (evt){onError(evt)};
  }

  data = {
    name:input_user_log.value,
    hashpass:input_pass_log.value
  }
  window.setTimeout(()=>{
    websocket.send(create_data("login",data));
  }, 100);
  

  // socket.emit('login',{
  //   name:input_user_log.value,
  //   hashpass:input_pass_log.value
  // },(response)=>{
  //   console.log(response.status);
  // })
}
function onRegister(){
  if(websocket ==null){
    var wsUri="ws://192.168.99.100:8000/"
    websocket = new WebSocket(wsUri); 
    websocket.onopen=function (evt){onOpen(evt)};
    websocket.onclose=function (evt){onClose(evt)};
    websocket.onmessage=function (evt){onMessage(evt)};
    websocket.onerror=function (evt){onError(evt)};
  }

  pass = input_pass_reg.value
  input_pass_reg.value = ""
  data = {
    name:input_user_reg.value,
    hashpass:pass
  }
  window.setTimeout(()=>{
    websocket.send(create_data("register",data));
  },100)
  
}

function onCloseRegister(){
  //document.getElementById("loginform").style.display = 'block'
  document.getElementById("registerform").style.display = 'none'
  
}
function onShowRegister(){
  //document.getElementById("loginform").style.display = 'none'
  document.getElementById("registerform").style.display = 'block'
  
}
function onCloseNotice(){
  document.getElementById("infor").style.display='none';
}

function onMainDev(){
  mainscreen.style.display = 'block';
  document.getElementById("loginform").style.display = 'none'
  document.getElementById("registerform").style.display = 'none'

}

function onUserDifineClick(evt){
  // var evt = window.event || evt
  // Create popup fix position to row
  comm = document.getElementById("Comm");
  comm.style.display='block';

  comm.lastElementChild.style.left = (evt.clientX-20) +'px';
  comm.lastElementChild.style.top = (evt.clientY-10) +'px';

  // get friend id
  friendId = parseInt(evt.currentTarget.getAttribute("pos"));
  console.log(friendId);
}

function onBlockClick(){
  // Change to block
  if(UserList[friendId].block == 0){
    var pos = UserList[friendId].viewpos;
    var s = userdisplay.children[pos]
    s.children[2].src='./images/block.png'
    UserList[friendId].block = 1
    // TODO Send server block message
    data = {
      userId:UserList[friendId].globalId,
      name:UserList[friendId].name,
      block:1
    }
    websocket.send(create_data("blockmsg",data));
  }
  onCloseComm();
}

function onChatClick(){
  // Join room
  data = {type:"joinRoom",friendId: UserList[friendId].globalId}
  websocket.send(create_data("chat",data));

  // TODO Set name chat
  onCloseComm();
}

function onUnblockClick(){
  if(UserList[friendId].block == 1){
    var pos = UserList[friendId].viewpos;
    var s = userdisplay.children[pos]
    s.children[2].src='./images/white.png'
    UserList[friendId].block = 0
    // TODO inform server
    data = {
      userId:UserList[friendId].globalId,
      name:UserList[friendId].name,
      block:0
    }
    websocket.send(create_data("blockmsg",data));
  }
  onCloseComm();
}

function onSendClick(){
  // Get message then send to server
  var message = document.getElementById("messagesend").value;
  data = {type:"message",friend: UserList[friendId].globalId,content:message}
  websocket.send(create_data("chat",data));
}

function onCloseComm(){
  document.getElementById("Comm").style.display='none';
}

function onStopChat(){
  //TODO clear chat message list

  data = {type:"outRoom",friend: UserList[friendId].globalId}
  websocket.send(create_data("chat",data));
}
