
const Logout = ({func}) => {
    return(
        <div className="containerlogout"> 
            <button className="logoutbtn" onClick={func} >Logout</button>
        </div>
        )
}

export default Logout;