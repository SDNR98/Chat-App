import { useEffect, useState } from "react"


const Warning = ({warningShow=false,warningTitle,warningMessage,warningType,callback}) => {
    const [show,setShow] = useState(false);

    useEffect(() => {
        if(warningType) {
            setShow(true);}
        if (warningShow) {
            clock()}
    },[warningShow===true])
    
    
    const clock = () => {
        setTimeout(()=>{
            setShow(false);
            callback()},3000);
    }

    return(
        <>
        
        {show ? <div id={warningType} className="warningcont">
            <button className="warningcontclose" onClick={()=> {clearTimeout(clock);
                                                                setShow(false);
                                                                callback()}}>x</button>
            <div>
                <h5> {warningTitle} </h5>
            </div>
            <div>
                <p> {warningMessage} </p>
            </div>
        </div> : <></> }
        </>
    )
}

export default Warning;