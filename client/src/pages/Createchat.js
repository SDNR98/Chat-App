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
        } if (e.target.value.length<=4){
            setBtn(true);
        }
    }

    const changedefaultwarning = () => {
        setWarning({Show:false,Title:'',Message:'',Type:''});
        if (window.localStorage.getItem("room_token")){
            navigate('./chat');
        }
        setBtn(false);
    }

    const createChat = async (e) => {
        setBtn(true);
        let data = passbox ? {name:chat.name} : {name:chat.name,password:chat.password} ;
        await axios.post(`${SERVERURI}/chatroom/create`,data,{headers:{"token":token_key}})
            .then((res)=>{
                if (res.status === 200)  {
                  setWarning({Show:true,Title:'Sucessful',Message:res.data.message,Type:'Sucess'});
                  window.localStorage.setItem("room_token", res.data.token);
                  window.localStorage.setItem("roomname", res.data.roomname);
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
            < Header />
            {token_key && !(window.localStorage.getItem("room_token")) ?
                <>
                <div className="Auth">
                    <div className='aligncenter'> 
                        <div className="containerheader" >
                            <h2 >Create Room</h2>
                        </div>
                    </div>
                    <div className='aligncenter'>
                        <label for="userName" className='textboxtitle'>Room name</label>
                        <input type="text" className='textbox' id="name" value={chat.name} placeholder='' onChange={(event)=>changeData(event)} />
                    </div>
                    <div className='aligncenter'>
                        <p className='textboxtitle'> Password Protected :- </p> 
                        <div className="textradio">
                            <input  type="radio"  name="neddpass" value={true} onChange={()=>setPassbox(false)} /> Yes 
                            <input type="radio"  name="neddpass" value={false} onChange={()=>setPassbox(true)} /> No
                        </div>
                    </div>
                    <input type="password" id="password" className='textbox' value={chat.password} placeholder='' disabled={passbox} onChange={(event)=>changeData(event)} />
                    <button type="submit" className="button"  onClick={(event)=>createChat(event)} disabled={btn} >Create</button>
                </div>
                <Warning warningShow={warning.Show} warningTitle={warning.Title} warningMessage={warning.Message} warningType={warning.Type} callback={changedefaultwarning} />
                </>
        : <> {window.localStorage.getItem("room_token") ? <Navigate to="../chat" replace /> :<Navigate to="../" replace /> } </> }
        </>
    )
}

export default Createchat;