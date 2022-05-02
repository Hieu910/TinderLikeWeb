
import React, {useEffect, useState, useContext} from 'react'
import { ChatEngineContext } from "react-chat-engine"
import { ChatContext } from "../context/ChatContext"
import { useCookies } from "react-cookie"
import {  getAllChats,createGroupChat } from '../api/chatengineAPI';

const GroupsDisplay = () => {

    const [cookies,setCookie,removeCookie] = useCookies(null)
    const userName = cookies.UserName
    const userSecret = cookies.UserSecret
    const [groups, setGroups] = useState([])
    const [groupName, setGroupName] = useState("")
    const { setActiveChat } = useContext(ChatEngineContext)
    const { setShowChat, setShowGroupChat} = useContext(ChatContext)


    const getGroups = ()=>{
    
        getAllChats(userName,userSecret)
        .then((res)=>{
            const groupsChat = res.data.filter((chat)=>{
                return chat.is_direct_chat === false
           })
           setGroups(groupsChat)
         })
      }
      const createGroup = ()=>{
        if(!groupName){
            alert("enter group name")
            return
        }
        setGroupName("")
        let formdata = new FormData()
        formdata.append("title", groupName)
        formdata.append("is_direct_chat", false);

        createGroupChat(userName,userSecret,formdata)
        .then((res)=>{
            getGroups()
        })
      }
      const handleClick = (id)=>{
          setShowGroupChat(true)
          setActiveChat(id)
      }
      useEffect(()=>{
        getGroups()
      },[])
    return (
        <div className="groups-display">
        <div className="create-group-container">
            <input className="group-name-input" placeholder="Enter group name" type="text" value={groupName} onChange={(e)=>{setGroupName(e.target.value)}}></input>
            <button className="add-group-button" onClick={createGroup}>Create</button>
        </div>
            { 
                groups.map(function(group){
                    return (<div key={group.id} className="match-card mb-3" onClick={()=>{handleClick(group.id)}}>
                    <h3>#{group.title}</h3>
                    </div>)
                })
            }
        </div>
    )
}

export default GroupsDisplay