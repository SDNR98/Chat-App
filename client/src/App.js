import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard.js';
import Createchat from './pages/Createchat';
import Joinchat from './pages/Joinchat'
import Chat from './pages/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (

    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createchat" element={<Createchat />} />
        <Route path="/joinchat" element={<Joinchat />} />
        <Route path="/chat" element={<Chat />} />
        <Route index element={<Home />} />
        <Route path="*" element={<NoPage />} />
        
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
