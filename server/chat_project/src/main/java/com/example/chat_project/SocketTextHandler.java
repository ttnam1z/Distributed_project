package com.example.chat_project;

import java.io.IOException;

import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class SocketTextHandler extends TextWebSocketHandler {

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message)
			throws InterruptedException, IOException {

		String payload = message.getPayload();
		JSONObject jsonObject = new JSONObject(payload);
        String msgtype = jsonObject.get("msgtype").toString();
        switch (msgtype){
            case "Login":
            case "Register":
            case "EnterChat1to1":
            case "EnterChatRoom":
            case "QuitChat":
        }
		session.sendMessage(new TextMessage("Hi " + jsonObject.get("user") + " how may we help you?"));
	}

}

// @Component
// public class MsgHandler implements WebSocketHandler{

//     @Override
//     public void afterConnectionClosed(WebSocketSession arg0, CloseStatus arg1) throws Exception {
//         // TODO Auto-generated method stub
        
//     }

//     @Override
//     public void afterConnectionEstablished(WebSocketSession arg0) throws Exception {
//         // TODO Auto-generated method stub
        
//     }

//     @Override
//     public void handleMessage(WebSocketSession arg0, WebSocketMessage<?> arg1) throws Exception {
//         // TODO Auto-generated method stub
        
//     }

//     @Override
//     public void handleTransportError(WebSocketSession arg0, Throwable arg1) throws Exception {
//         // TODO Auto-generated method stub
        
//     }

//     @Override
//     public boolean supportsPartialMessages() {
//         // TODO Auto-generated method stub
//         return false;
//     }

// }