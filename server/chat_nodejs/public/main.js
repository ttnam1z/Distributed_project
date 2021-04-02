let input_user_reg = document.getElementById("user_reg");
let input_pass_reg = document.getElementById("pass_reg");
let input_user_log = document.getElementById("user_log");
let input_pass_log = document.getElementById("pass_log");

function onLoad(){
  
}

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

var wsUri="ws://192.168.99.100:8000"
  websocket = new WebSocket(wsUri);
  websocket.onopen=function (evt){onOpen(evt)};
  websocket.onclose=function (evt){onClose(evt)};
  websocket.onmessage=function (evt){onMessage(evt)};
  websocket.onerror=function (evt){onError(evt)};

function onOpen(evt){
  console.log("open websocket ok")
}
function onClose(evt){
  
}
function onMessage(evt){
  
}
function onError(evt){
  
}


function onLogin(){
  socket.emit('login',{
    name:input_user_log.value,
    hashpass:input_pass_log.value
  },(response)=>{
    console.log(response.status);
  })
}
function onRegister(){

}

function onChangeLogin(){
  document.getElementById("loginform").style.display = 'block'
  document.getElementById("registerform").style.display = 'none'
}
function onChangeRegister(){
  document.getElementById("loginform").style.display = 'none'
  document.getElementById("registerform").style.display = 'block'
}