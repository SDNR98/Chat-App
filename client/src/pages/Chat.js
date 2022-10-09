import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {io} from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from 'axios';
import Warning from '../components/Warning';
import Header from "../components/Header";

function Chat() {

  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState("");
  const [warning,setWarning] = useState({Show:false,Title:'',Message:'',Type:''});
  const [messageList, setMessageList] = useState([]);

  const socket = useRef();

  let room_token = window.localStorage.getItem("room_token");
  const username = window.localStorage.getItem("username");
  const room = window.localStorage.getItem("roomname");

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        auth: {auth:room_token},
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes()+
          ":" +
          new Date(Date.now()).getSeconds()
      };
      socket.current.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const leaveChatroom = async () => {
    socket.current.emit("leave", {auth:{auth:room_token}});
    await axios.post('http://localhost:3001/user/leave',{},{headers:{"token":room_token}})
        .then((res)=>{
            if (res.status === 200)  {
              window.localStorage.removeItem("room_token");
              setWarning({Show:true,Title:'Sucessful',Message:res.data.message,Type:'Sucessful'});
            } else {
              setWarning({Show:true,Title:'Error',Message:res.data.message,Type:'Error'}) }
        })
        .catch((err)=>{
          (err.response.data) ? setWarning({Show:true,Title:'Error',Message:err.response.data.message,Type:'Error'}) :
          setWarning({Show:true,Title:'Error',Message:err.message,Type:'Error'});
        })
}

  const changedefaultwarning = () => {
    setWarning({Show:false,Title:'',Message:'',Type:''});
    if (!window.localStorage.getItem("room_token")){
      navigate('../dashboard');
  }
  }

  useEffect(()=> {
    socket.current = io.connect("http://localhost:3001",{auth:{auth:room_token}});
  },[])

  useEffect(() => {
    socket.current.on("receive_message", (data) => {
      if (data.leave){
        window.localStorage.removeItem("room_token");
        setWarning({Show:true,Title:'Error',Message:data.message,Type:'Error'});
      }
      else{
        setMessageList((messageList) => [...messageList, data]);
      }
    });
  }, [socket.current]);

  return (
    <>
    <Header/>
    {room_token ? 
    <div className="">
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat : {room}</p> <buttton type="submit" onClick={leaveChatroom}>X</buttton>
      </div>
      
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent,key) => {
           return messageContent.system && messageContent!== messageList[key-1] ?  (
            <div className="message-admin">
           <p> {messageContent.author} {messageContent.message} room </p></div>
           ) :
            (messageContent!== messageList[key-1]) ?
             (
              <div
                key={key}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            ) :   ( <></>);
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type a message.."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      </div>
    </div> : <>Error</>}
    <Warning warningShow={warning.Show} warningTitle={warning.Title} warningMessage={warning.Message} warningType={warning.Type} callback={changedefaultwarning} />
    </>
    
  );
}

export default Chat;