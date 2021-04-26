let input_user_reg = document.getElementById("user_reg");
let input_pass_reg = document.getElementById("pass_reg");
let input_user_log = document.getElementById("user_log");
let input_pass_log = document.getElementById("pass_log");
let mainscreen = document.getElementById("mainscreen");
let notice = document.getElementById("infor");

function show_notice(msg){
  notice.lastElementChild.lastChild.textContent = msg;
  notice.style.display = 'block';
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
  
}

function processLoginRes(msg){
  if(msg == "OK"){
    // Change to main screen
    document.getElementById("main_name").innerHTML = input_user_log.value
    mainscreen.style.display = 'block';
    document.getElementById("loginform").style.display = 'none'
    document.getElementById("registerform").style.display = 'none'
  } else {
    // show notify 
    show_notice("login fail");
  }
}

function processRegisterRes(msg){
  if(msg == "OK"){
    input_user_log.value = input_user_reg.value;
    // send login detail
    data = {
      name:input_user_reg.value,
      hashpass:input_pass_reg.value
    }
    websocket.send(create_data("login",data));
  } else {
    // show notify 
    show_notice("register fail");
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
    default:
  }
}

function onError(evt){
  
}

function onLogout(){
  websocket.send(create_data("logout","OK"));
  mainscreen.style.display = 'none';
  document.getElementById("loginform").style.display = 'block'
}

function onLogin(){
  pass = input_pass_log.value
  input_pass_log.value = ""
  data = {
    name:input_user_log.value,
    hashpass:pass
  }
  websocket.send(create_data("login",data));

  // socket.emit('login',{
  //   name:input_user_log.value,
  //   hashpass:input_pass_log.value
  // },(response)=>{
  //   console.log(response.status);
  // })
}
function onRegister(){
  pass = input_pass_reg.value
  input_pass_reg.value = ""
  data = {
    name:input_user_reg.value,
    hashpass:pass
  }
  websocket.send(create_data("register",data));
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