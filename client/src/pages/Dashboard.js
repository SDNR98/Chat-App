import React, { useEffect } from "react";
import {Navigate, useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Logout from "../components/Logout";
import axios from "axios";
import SERVERURI from '../config';

const Dashboard = () => {
  const navigate = useNavigate();
  let token_key = window.localStorage.getItem("capp_token");

  const logout = ()=> {
    window.localStorage.removeItem("capp_token");
    window.localStorage.removeItem("room_token");
    navigate('./');
  }

  const getChat = ()=> {
    axios.post(`${SERVERURI}/user/get`,{},{headers:{"token":token_key}})
    .then((res)=>{
      if (res.status===200){
        window.localStorage.setItem("roomname", res.data.roomname);
        window.localStorage.setItem("room_token", res.data.token);
      } else {
        window.localStorage.removeItem("roomname");
        window.localStorage.removeItem("room_token");
      }
    })
    .catch(errr=>{
      window.localStorage.removeItem("roomname");
      window.localStorage.removeItem("room_token");
    })
  }

  useEffect(()=>{
    getChat();
  },[])

  return (
    <>
      < Header />
      { token_key ? 
      <>
        <Logout func={logout} />
        <div className="Auth">
          <div className='aligncenter'>
          <button className="button btnroom" onClick={()=>navigate('/createchat')}>Create Room</button>
          <button className="button btnroom" onClick={()=>navigate('/joinchat')}>Join Room</button>
          </div>
        </div>
      </> : <> <p> Redirecting...</p> <Navigate to="../" replace /> </> }
    </>
  )
}

export default Dashboard;