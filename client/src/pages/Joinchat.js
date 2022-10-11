import React, { useState } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import axios from "axios";
import Warning from '../components/Warning';
import Header from '../components/Header';
import SERVERURI from '../config';

const Createchat = () => {
    const navigate = useNavigate();
    const [chat,setChat] = useState({name:"",password:""});
    const [warning,setWarning] = useState({Show:false,Title:'',Message:'',Type:''});
    const [btn,setBtn] = useState(true);
    const [passbox,setPassbox] = useState(true);

    let token_key = window.localStorage.getItem("capp_token");

    const changeData = (e) => {
        setChat({...chat,[e.target.id]:e.target.value});
        if (e.target.value.length>4){
            setBtn(false);
        } 
        if (e.target.value.length<=4){
            setBtn(true);
        }    
    }

    const changedefaultwarning = () => {
        setWarning({Show:false,Title:'',Message:'',Type:''});
        if (window.localStorage.getItem("room_token")){
            navigate('./chat',{replace:true});
        }
        setBtn(false);
    }

    const createChat = async (e) => {
        setBtn(true);
        axios.post(`${SERVERURI}/chatroom/join`,chat,{headers:{"token":token_key}})
            .then((res)=>{
                if (res.status === 200)  {
                    if (res.data.needPass){
                        setPassbox(false);
                    } else 
                  {setWarning({Show:true,Title:'Sucessful',Message:res.data.message,Type:'Sucess'});
                  let token = res.data.token;
                  window.localStorage.setItem("room_token", token);
                  window.localStorage.setItem("roomname", res.data.roomname);
                  navigate("./");}
                } else {
                   console.log(res.data) }
            })
            .catch((err)=>{
              console.log(err);
              (err.response.data) ? setWarning({Show:true,Title:'Error',Message:err.response.data.message,Type:'Error'}) :
              setWarning({Show:true,Title:'Error',Message:err.message,Type:'Error'});
            })

    }
    
    
    return (
        
        <>
        <Header />
            {token_key && !(window.localStorage.getItem("room_token")) ?
            <>
            <div className="Auth">
                <div className="containerheader" >
                    <h2 >Join Room</h2>
                </div>
                <div className='aligncenter'>
                    <label for="userName" className='textboxtitle'>Room name</label>
                    <input type="text" id="name" className='textbox' value={chat.name} placeholder='' onChange={(event)=>changeData(event)} />
                </div>
                <div className='aligncenter'>
                    <p className='textboxtitle' style={{display:[passbox ?  "none" :  "block"]}}> Password </p> 
                    <input type="password" id="password" className='textbox' value={chat.password} placeholder='Password needed' style={{display:[passbox ?  "none" :  "block"]}} onChange={(event)=>changeData(event)} />
                </div>
                <button type="submit" className="button" onClick={(event)=>createChat(event)} disabled={btn} >Join Room</button>
            </div>
            <Warning warningShow={warning.Show} warningTitle={warning.Title} warningMessage={warning.Message} warningType={warning.Type} callback={changedefaultwarning} />
            </>
        :<> {window.localStorage.getItem("room_token") ? <Navigate to="../chat" replace /> :<Navigate to="../" replace /> } </> }
        </>
    )
}

export default Createchat;