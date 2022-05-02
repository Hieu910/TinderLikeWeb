import { HeaderContext } from "../context/HeaderContext"
import { UserContext } from "../context/UserContext"
import { ChatContext } from "../context/ChatContext"
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import SideBarContainer from "../components/SideBarContainer"
import { ChatEngine} from 'react-chat-engine'
import { useNavigate } from "react-router-dom"
import SwipeMenu from "../components/SwipeMenu";
import ChatHeader from "../components/ChatHeader";
import ChatSettings from "../components/ChatSettings";
import Userinfo from "../components/UserInfo";
import { getAllUsers, getUserById } from '../api/chatengineAPI';
import { ChatEngineContext } from "react-chat-engine"
const Dashboard = () => {
  const { chats, activeChat ,setActiveChat } = useContext(ChatEngineContext)
  console.log(activeChat)
  
    const { user,userData,setUserData,
          setUser,matchedUserIds,
          notMatchedUserIds,
          setMatchedUserIds,
          setNotMatchedUserIds
        } = useContext(UserContext)
    const { searchFilter, showInfo } = useContext(HeaderContext)
    const {showChat,showGroupChat,isFirstRender} = useContext(ChatContext)
    
    const [genderedUsers, setGenderedUsers] = useState([])
    const [cookies, setCookie, removeCookie] = useCookies("user")
    const userId  = Number(cookies.UserId)
 
    const navigate = useNavigate()
  
    
    const getUser = ()=>{
        try{
          getUserById(userId)
          .then((response)=>{
            if(!response.data.first_name){
              navigate("/onboarding")
              window.location.reload()
            }
            setUser(response.data)
            setUserData(JSON.parse(response.data.custom_json))
            setMatchedUserIds(JSON.parse(response.data.custom_json).matches)
            setNotMatchedUserIds(JSON.parse(response.data.custom_json).not_matches)
          })
          .catch((err)=>{console.log(err)})
        }
        catch (err){
          console.log(err);
        }
    }

    const getGenderedUsers = ()=>{
      try {
       getAllUsers()
       .then((users)=>{
          if(userData.gender_interest === "everyone")
          {
            const interestUsers = users.data.filter((foundUser)=>{
              return foundUser.id !== userId;
            })
            setGenderedUsers(interestUsers)
          } else{
            const interestUsers = users.data.filter((foundUser)=>{
              return ((JSON.parse(foundUser.custom_json).gender_identity===userData.gender_interest) && (foundUser.id !== userId));
            })
            setGenderedUsers(interestUsers)
          }
       })   
      }
      catch (err){
        console.log(err)
      }
    }

    useEffect(()=>{
      getUser()
    },[])

    useEffect(()=>{
      if(user){
        getGenderedUsers()
      }

    },[user,userData])

   
      //khoang cach 2 diem tren ban do
      const distance = (lat1, lon1, lat2, lon2)=>{
        var p = 0.017453292519943295;
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
                c(lat1 * p) * c(lat2 * p) * 
                (1 - c((lon2 - lon1) * p))/2;

        return (12742 * Math.asin(Math.sqrt(a))).toFixed(1); 
      }

    const filterAgeUsers = function(){
        if(searchFilter?.ageOption){
           return genderedUsers?.filter(function(genderedUser){
                const genderedUserAge = (new Date().getFullYear() - Number(JSON.parse(genderedUser.custom_json).dob_year))
                return genderedUserAge>= Number(searchFilter?.ageOption.agefrom) && genderedUserAge<= Number(searchFilter.ageOption.ageto)
          })
        }
        return genderedUsers
    }
    const filterDistanceUsers = function(filteredAgeUsers){
      if(searchFilter?.distanceOption){
         return filteredAgeUsers?.filter(function(filteredAgeUser){
          const location = JSON.parse(filteredAgeUser.custom_json).location
          const distant = distance(location.latitude,location.longitude,userData.location.latitude,userData.location.longitude)
              return distant <= Number(searchFilter?.distanceOption)
        })
      }
      return filteredAgeUsers
    }
    const filterPassionUsers = function(filteredDistanceUsers){
      if(searchFilter?.passionOption){
        return filteredDistanceUsers?.filter(function(filteredDistanceUser){
              const passions = JSON.parse(filteredDistanceUser.custom_json).passions
            return passions.includes(searchFilter?.passionOption)
        })
      }
      return filteredDistanceUsers
    }

    const filteredAgeUsers = filterAgeUsers()
    const filteredDistanceUsers = filterDistanceUsers(filteredAgeUsers)
    const filteredPassionUsers = filterPassionUsers(filteredDistanceUsers)

    const filteredMatchedGenderedUsers = filteredPassionUsers?.filter(function(genderedUser){
      return !matchedUserIds.includes(genderedUser.id) && !notMatchedUserIds.includes(genderedUser.id)
    }) 

  return (
    <div>
    {user &&
    <div className="dashboard">
      <SideBarContainer /> 

      { !showChat &&
          <SwipeMenu 
            filteredMatchedGenderedUsers={filteredMatchedGenderedUsers} 
            distance={distance}
          />}
        
        { showInfo &&
          <div className="user-info" style={{ fontFamily: "Readex Pro"}}>
              <Userinfo />
          </div>
        }
        {isFirstRender && 

        <div className={showChat ? "chatengine show-chat":"chatengine"} style={{ fontFamily: "Readex Pro"}}>
        <ChatEngine                
                              
                  offset={+7}
                  height="100vh"
                  projectID="9634dd60-e53b-4d63-a793-711552089ad4"
                  userName={cookies.UserName}
                  userSecret={cookies.UserSecret}
                  renderNewChatForm={(creds) => {}}
                  renderChatHeader={(chat) => chat ? <ChatHeader chat={chat}/> :null}
                  renderChatSettingsTop={(creds, chat) => chat ? <ChatSettings 
                                                            creds={creds}
                                                            chat={chat}
                                                            distance= {distance}
                                                          /> :null}
                  onNewMessage={() => new Audio('https://chat-engine-assets.s3.amazonaws.com/click.mp3').play()}   
              />
       </div>
        }
        
        

       { showGroupChat ?
       <div className={showGroupChat ? "chatengine show-groups":"chatengine"} style={{ fontFamily: "Readex Pro"}}>
        <ChatEngine 
              
                  offset={+7}
                  height="100vh"
                  projectID="9634dd60-e53b-4d63-a793-711552089ad4"
                  userName={cookies.UserName}
                  userSecret={cookies.UserSecret}
                  renderChatHeader={(chat) => chat ? <ChatHeader chat={chat}/> :null}
                  onNewMessage={() => new Audio('https://chat-engine-assets.s3.amazonaws.com/click.mp3').play()}
                 
              />
       </div> : null
       }
    </div>}
   
    </div>
  );
};

export default Dashboard;
