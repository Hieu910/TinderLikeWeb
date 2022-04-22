
import React, {useEffect, useState, useContext} from 'react'
import { ChatEngineContext } from "react-chat-engine"
import { useCookies } from "react-cookie"
import online from "../images/online-status.png"
import offline from "../images/offl-status.png"
import {  getAllUsers, getAllChats, getOrCreateChat } from '../api/chatengineAPI';

const MatchesDisplay = ({matches, setShowChat,showChat,setClickedUser,setShowGroupChat}) => {
    const [matchedProfiles, setMatchedProfiles] = useState([])
    const [cookies,setCookie,removeCookie] = useCookies(null)
    const userId = Number(cookies.UserId)
    const userName = cookies.UserName
    const userSecret = cookies.UserSecret
    const { setActiveChat } = useContext(ChatEngineContext)
    
    const getMatches = ()=>{
        try{
            getAllUsers()
            .then((users)=>{
              const matchedUsers = users.data.filter((user)=>{
                return matches.includes(user.id);
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
      if(!showChat){
        setShowChat(true);
      }
      setShowGroupChat(false)
      setClickedUser(match)
      getChat(match)
    }
    const getChat = (match)=>{
        getAllChats(userName,userSecret)
        .then((userchats)=>{
          const existChat = userchats.data.filter((chat)=>{
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
        })
        .catch((err)=>{
          console.log(err)
        })
    }
    useEffect(()=>{
      getMatches()
    },[matches])

    return (
        <div className="matches-display">
          {
            matchedProfiles.map(function(match){
            return (<div key={match.id} className="match-card mb-3" onClick={()=>{handleClick(match)}}>
              <div className="avatar-container skeleton" style={{ backgroundImage: "url(" + match.avatar + ")", backgroundSize:"cover",backgroundPosition:"center" }}>
              </div>
              <img alt="" className="user-status" src={ match.is_online ? online: offline}/>
              <h3>{match?.first_name +" " + match?.last_name}</h3>
            </div>)
          })
          }
        </div>
    )
}

export default MatchesDisplay