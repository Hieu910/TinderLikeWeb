
import React, {useEffect, useState, useContext} from 'react'
import { ChatEngineContext } from "react-chat-engine"
import { ChatContext } from "../context/ChatContext"
import { UserContext } from "../context/UserContext"
import { useCookies } from "react-cookie"
import online from "../images/online-status.png"
import offline from "../images/offl-status.png"
import newMessage from "../images/new-message.png"
import {  getAllUsers, getOrCreateChat,getAllChats } from '../api/chatengineAPI';

const MatchesDisplay = () => {
    const [matchedProfiles, setMatchedProfiles] = useState([])
    const [cookies,setCookie,removeCookie] = useCookies(null)
    const userId = Number(cookies.UserId)
    const userName = cookies.UserName
    const userSecret = cookies.UserSecret
    const [checkUnRead,setCheckUnRead] = useState([])

    const { chats,setActiveChat } = useContext(ChatEngineContext)
    const {showChat, setShowChat, setShowGroupChat, setIsFirstRender} = useContext(ChatContext)
    const {matchedUserIds, setClickedUser} = useContext(UserContext)
  

    const getMatches = ()=>{
        try{
            getAllUsers()
            .then((users)=>{
              const matchedUsers = users.data.filter((user)=>{
                return matchedUserIds.includes(user.id);
            })
              const filteredProfiles = matchedUsers?.filter((matchedProfile)=>{
                  return JSON.parse(matchedProfile.custom_json).matches.includes(userId)    
              })
       
              if(filteredProfiles)
              setMatchedProfiles(filteredProfiles)
            })
          }
        catch (err){
          console.log(err)
        }
    }
    
    const handleClick = (match)=>{
      setIsFirstRender(true)
      if(!showChat){
        setShowChat(true);
      }
      setShowGroupChat(false)
      setClickedUser(match)
      getChat(match)
    }
 
    const checkUnReadMessage = ()=>{
        getAllChats(userName,userSecret)
        .then((userchats)=>{
        const chats = userchats.data
        
        const unReadChats = chats.filter((chat)=>{
            const userLastRead = chat.people?.find((person)=>{
               return person.person.username === userName
            }).last_read;
            return chat.last_message.id && (chat.last_message.id !== userLastRead) && (chat.last_message.sender_username !==userName) 
        })
           
          if(unReadChats){
            const unReadUserNames = unReadChats.map((unReadChat)=>{
              const unReadUserName = unReadChat.people?.find((person)=>{
                return person.person.username !== userName
             }).person.username
             return unReadUserName
            })
           
            setCheckUnRead(unReadUserNames)
          }  
          })
        .catch((err)=>{
          console.log(err)
        })
    }
    
    const checkUnReadChat = (matchedUserName)=>{
        return checkUnRead.includes(matchedUserName)
    }
    const getChat = (match)=>{
     
          if(chats){
          const userchats = Object.values(chats)
          const existChat = userchats.filter((chat)=>{
            const people = chat.people
            const found = people.find((person)=>{
                return person.person.username === match.username
            })
              return found && chat.is_direct_chat===true 
         })
        if(existChat[0]){
          setActiveChat(existChat[0].id)
        }
        else{
          let formdata = new FormData()
          formdata.append("usernames",[match.username]);
          formdata.append("title", match.first_name + match.last_name)
          formdata.append("is_direct_chat", true);
            getOrCreateChat(userName,userSecret,formdata)
            .then((res)=>{
              setActiveChat(res.data.id)
            })
            .catch((err)=> console.log(err))
        }
      }
    
    }
    
    useEffect(()=>{
      getMatches()
    },[matchedUserIds])

    useEffect(()=>{
      checkUnReadMessage()
    },[chats])
    
   
    return (
        <div className="matches-display">
          {
            matchedProfiles.map(function(match){
            return (<div key={match.id} className="match-card" onClick={()=>{handleClick(match)}}>
              <div className="avatar-container skeleton" style={{ backgroundImage: "url(" + match.avatar + ")", backgroundSize:"cover",backgroundPosition:"center" }}>
              </div>
              <img alt="" className="user-status" src={ match.is_online ? online: offline}/>
              <h3>{match?.first_name +" " + match?.last_name}</h3>
              { checkUnReadChat(match.username) && <img className='new-message-icon' alt="" src={newMessage}/>}
            </div>)
          })
          }
        </div>
    )
}

export default MatchesDisplay