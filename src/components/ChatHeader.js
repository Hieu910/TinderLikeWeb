import React, { useEffect, useState , useContext} from "react";
import {IoReturnDownBackOutline}  from "react-icons/io5"
import { UserContext } from "../context/UserContext"
import { ChatContext } from "../context/ChatContext"


const ChatHeader = ({chat})=>{
  
    const [recipientAvatar,setRecipientAvatar]= useState("") 
    const { clickedUser } = useContext(UserContext)
    const { setShowChat, showChat, setShowGroupChat } = useContext(ChatContext)
    
    const chatHeaderInfo = ()=>{
        if(chat){
                const date = new Date(chat.created);
                return "Chat created on "+ date.toDateString(); 
            }
        return null
    }
    const closeChat = ()=>{
        showChat ? setShowChat(false) : setShowGroupChat(false)
    }
    useEffect(()=>{
        if(clickedUser){
            setRecipientAvatar(clickedUser.avatar)
        }
    },[clickedUser])
    return (
      
        <div className="chat-header">
            
            <div onClick={closeChat} className="icon-container"><IoReturnDownBackOutline className="return-icon"/></div>
            {
                showChat && <div className="chat-avatar">
                    <div className="avatar-container skeleton" style={{ backgroundImage: "url(" + recipientAvatar + ")", backgroundSize:"cover",backgroundPosition:"center", height:"60px",width:"60px"}} ></div>
                 </div> 
            } 
            <div className="chat-info">{chatHeaderInfo()}</div>
        </div>
    )
}

export default ChatHeader