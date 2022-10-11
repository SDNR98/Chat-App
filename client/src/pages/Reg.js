import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Warning from '../components/Warning';
import SERVERURI from '../config';

const Reg = () => {
    const navigate = useNavigate();
    const [user,setUser] = useState({userName:'',password:'',repass:''});
    const [warning,setWarning] = useState({Show:false,Title:'',Message:'',Type:''});
    const [Regbtn,setregbtn] = useState(true);
    const [error,setError] = useState({userName:'',password:'',repass:''});

    const changedefaultwarning = () => {
      setWarning({Show:false,Title:'',Message:'',Type:''});
      if (window.localStorage.getItem("capp_token")){
        navigate('/dashboard');
      }
      setregbtn(false);
    }


    const changeData = (e) => {
        setUser({...user,[e.target.id]:e.target.value});
        if (e.target.value.length <4) {
          setregbtn(true);
          setError({...error,[e.target.id]:`${e.target.id} should at least 4 characters`});
          document.getElementById(String([e.target.id]+'.'+'err')).style.display='block';
        } else {
          document.getElementById(String([e.target.id]+'.'+'err')).style.display='none';
        } if (e.target.id ==='password' && e.target.value===user.repass) {
          setregbtn(true);
        }
        
    }

    const checkPass = (e) => {
      setUser({...user,[e.target.id]:e.target.value});
      if (!(user.password===e.target.value)) {
        setregbtn(true);
        setError({...error,[e.target.id]:`Password doesnot match`});
        document.getElementById(String([e.target.id]+'.'+'err')).style.display='block';
      } else if (user.password===e.target.value) {
        document.getElementById(String([e.target.id]+'.'+'err')).style.display='none';
        setregbtn(false);
      }
    }

    const sendData = async () => {
        await axios.post(`${SERVERURI}/user/reg`,{userName:user.userName,password:user.password})
            .then((res)=>{
                if (res.status === 200)  {
                  setWarning({Show:true,Title:'Sucessful',Message:res.data.message,Type:'Sucessful'});
                  let token = res.data.token;
                  window.localStorage.setItem("capp_token", token);
                  window.localStorage.setItem("username", res.data.username);
                } else {
                   console.log(res.data) }
            })
            .catch((err)=>{
              console.log(err);
              (err.response.data) ? setWarning({Show:true,Title:'Error',Message:err.response.data.message,Type:'Error'}) :
              setWarning({Show:true,Title:'Error',Message:err.message,Type:'Error'});
            })
    }

    const regUser = (e) => {
        setregbtn(true);
        
        sendData();
    }
    return (
      <>
      <form onSubmit={event=>event.preventDefault()}>
      <div className='aligncenter'>
        <label for="userName" className='textboxtitle'>UserName</label>
        <input type="text" id="userName" className='textbox' value={user.userName} placeholder='' onChange={(event)=>changeData(event)}></input>
        <p id="userName.err" className="textboxerr" display="hidden"> {error.userName} </p>
      </div>

      <div className='aligncenter'>
        <label for="password" className='textboxtitle'>Password</label>
        <input type="password" id="password" className='textbox' value={user.password} placeholder='' onChange={(event)=>changeData(event)}></input>
        <p id="password.err" className="textboxerr" display="hidden"> {error.password} </p>
      </div>
        
      <div className='aligncenter'>
        <label for="repass" className='textboxtitle'>Re Enter Password</label>
        <input type="password" id="repass" className='textbox' value={user.repass} placeholder='' onChange={(event)=>checkPass(event)}></input>
        <p id="repass.err" className="textboxerr" display="hidden"> {error.repass} </p>
      </div>
        
        <button type="submit" className="button btnreg" onClick={(event)=>regUser(event)} disabled={Regbtn} >Registration</button>
      </form>
      <Warning warningShow={warning.Show} warningTitle={warning.Title} warningMessage={warning.Message} warningType={warning.Type} callback={changedefaultwarning} />
      
      </>
    ) 
  };
  
  export default Reg;