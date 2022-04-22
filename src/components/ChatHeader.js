import React, { useEffect, useState } from "react";
import {IoReturnDownBackOutline}  from "react-icons/io5"



const ChatHeader = ({chat,setShowChat,clickedUser})=>{
  
    const [recipientAvatar,setRecipientAvatar]= useState("") 

    const chatHeaderInfo = ()=>{
        if(chat){
                const date = new Date(chat.created);
                return "Chat created on "+ date.toDateString(); 
            }
        return null
    }

    useEffect(()=>{
        if(clickedUser){
            setRecipientAvatar(clickedUser.avatar)
        }
    },[clickedUser])
    return (
        <div className="chat-header">
            <div onClick={()=>{setShowChat(false)}} className="icon-container"><IoReturnDownBackOutline className="return-icon"/></div>
            <div className="chat-header-avatar">
                <div className="avatar-container skeleton" style={{ backgroundImage: "url(" + recipientAvatar + ")", backgroundSize:"cover",backgroundPosition:"center", height:"60px",width:"60px"}} ></div>
            </div>
            <div className="chat-header-info">{chatHeaderInfo()}</div>
           
        </div>
    )
}

export default ChatHeader