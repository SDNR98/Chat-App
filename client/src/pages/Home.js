import { Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Login from "./Login";
import Reg from "./Reg";
import Header from '../components/Header';


const Home = () => {
  const [disLogin,setDisLogin] = useState (true);

    return (
    <>
      {window.localStorage.getItem("capp_token") ? <Navigate to="./dashboard" replace /> : 
      <div >
          <Header />
          <div className='Auth'>
            <nav className='navigation'>
              <button className='navselect ' id={disLogin ? "selectlog" : " "} onClick={()=>setDisLogin(true)}>Login</button>
              <button className='navselect navselect2' id={!disLogin ? "selectreg" : " "} onClick={()=>setDisLogin(false)}>Registration</button>
            </nav>
          <div >
          {disLogin ? <Login/> : <Reg/>}
          </div>
          </div> 
      </div>} 
    </>
    ) 
  };
  
  export default Home;