import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Warning from '../components/Warning';

const Reg = () => {
    const navigate = useNavigate();
    const [user,setUser] = useState({userName:'',password:''});
    const [warning,setWarning] = useState({Show:false,Title:'',Message:'',Type:''});
    const [Regbtn,setregbtn] = useState(false);
    const [error,setError] = useState({userName:'',password:'',});

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
          setError({...error,[e.target.id]:`${e.target.id} should at least 4 characters`});
          document.getElementById(String([e.target.id]+'.'+'err')).style.display='block';
        } else {
          document.getElementById(String([e.target.id]+'.'+'err')).style.display='none';
        }
    }


    const sendData = async () => {
        await axios.post('http://localhost:3001/user/login',user)
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
        e.target.innerHtml = "Processing...";
        setregbtn(true);
        sendData();
    }
    return (
      <>
      <form onSubmit={event=>event.preventDefault()}>
        
      <div className='aligncenter'>
        <label for="userName" className='textboxtitle'>UserName</label>
        <input type="text" id="userName" className='textbox' value={user.userName} placeholder='' onChange={(event)=>changeData(event)}></input>
        <span className="textboxerr" id="userName.err" display="hidden"> {error.userName} </span>
      </div>  

      <div className='aligncenter'>
        <label for="password" className='textboxtitle'>Password</label>
        <input type="password" id="password" className='textbox' value={user.password} placeholder='' onChange={(event)=>changeData(event)}></input>
        
        <p id="password.err" className="textboxerr" display="hidden"> {error.password} </p>
      </div>
        <button type="submit" className="button"  onClick={(event)=>regUser(event)} disabled={Regbtn} >Login</button>
      </form>
      <Warning warningShow={warning.Show} warningTitle={warning.Title} warningMessage={warning.Message} warningType={warning.Type} callback={changedefaultwarning} />
      
      </>
    ) 
  };
  
  export default Reg;