import React, { useState } from 'react';
import SockJsClient from 'react-stomp';
import './App.css';
import Input from './components/Input/Input';
import LoginForm from './components/LoginForm';
import Messages from './components/Messages/Messages';
import chatAPI from './services/chatapi';
import { randomColor } from './utils/common';


const SOCKET_URL = 'http://localhost:8081/ws-chat/';

const App = () => {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)

  const onConnected = () => {
    console.log("Connected!!")
  }

  const onMessageReceived = (msg) => {
    console.log('New Message Received!!', msg);
    setMessages(messages.concat(msg));
  }

  const onSendMessage = (msgText) => {
    // const msg = new Object();
    // msg.content = 'Forddddd';
    chatAPI.sendMessage(user.username, msgText)
        .then(res => {
            console.log('Sent', res);
        })
        .catch(err => {
          const msg = {
            content: 'Error Occured while sending message to api',
            sender: 'system'
          };
          onMessageReceived(msg);
          console.log(msg.content);
        })
  }

  let handleLoginSubmit = (username) => {
    console.log(username, " Logged in..");

    setUser({
      username: username,
      color: randomColor()
    })

  }

  return (
    <div className="App">
      {!!user ?
        (
          <>
            <SockJsClient
              url={SOCKET_URL}
              topics={['/topic/group']}
              onConnect={onConnected}
              onDisconnect={console.log("Disconnected!")}
              onMessage={msg => onMessageReceived(msg)}
              debug={false}
            />
            <Messages
              messages={messages}
              currentUser={user}
            />
            <Input onSendMessage={onSendMessage} />
          </>
        ) :
        <LoginForm onSubmit={handleLoginSubmit} />
      }
    </div>
  )
}

export default App;
