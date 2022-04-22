
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import SideBarContainer from "../components/SideBarContainer"
import { ChatEngine} from 'react-chat-engine'
import { useNavigate } from "react-router-dom"
import SwipeMenu from "../components/SwipeMenu";
import ChatHeader from "../components/ChatHeader";
import ChatSettings from "../components/ChatSettings";
import Userinfo from "../components/UserInfo";
import {  getAllUsers,getUserById, updateUser } from '../api/chatengineAPI';

const Dashboard = () => {
    
    const [user, setUser] = useState({
      first_name:"",
      last_name:"",
      avatar:""
    })
    const [userData, setUserData] = useState("")
    const [searchFilter,setSearchFilter] = useState({
      distanceOption:"",
      ageOption:"",
      passionOption:""
    }) 
    const [genderedUsers, setGenderedUsers] = useState([])
    const [cookies, setCookie, removeCookie] = useCookies(["user"])
    const userId  = Number(cookies.UserId)
    const [matchedUserIds, setMatchedUserIds] = useState([])
    const [notMatchedUserIds, setNotMatchedUserIds] = useState([])
    const [showInfo, setShowInfo] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [showGroupChat,setShowGroupChat] =useState(false)
    const [showGroupsList,setShowGroupsList] =useState(false)
    const [clickedUser,setClickedUser] = useState("")
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



    const updatedMatches = (matchedUserId)=>{
      userData.matches.push(matchedUserId)
      let formdata = new FormData()
      formdata.append("custom_json",JSON.stringify(userData));
        try{
          updateUser(userId,formdata)
          .then((res)=>{
              setMatchedUserIds(JSON.parse(res.data.custom_json).matches)
              setUserData(JSON.parse(res.data.custom_json))
          })
          .catch((err)=>{
              console.log(err)
          })
         
        } catch (err){
          console.log(err)
        }
    }
    
    const updatedNotMatches = (notMatchedUserId)=>{
      userData.not_matches.push(notMatchedUserId)
      let formdata = new FormData()
      formdata.append("custom_json",JSON.stringify(userData));
        try{
          updateUser(userId,formdata)
          .then((res)=>{
            setNotMatchedUserIds(JSON.parse(res.data.custom_json).not_matches)
            setUserData(JSON.parse(res.data.custom_json))
          })
          .catch((err)=>{
              console.log(err)
          })
        } catch (err){
          console.log(err)
        }
    }

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
        if(searchFilter.ageOption){
           return genderedUsers?.filter(function(genderedUser){
                const genderedUserAge = (new Date().getFullYear() - Number(JSON.parse(genderedUser.custom_json).dob_year))
                return genderedUserAge>= Number(searchFilter.ageOption.agefrom) && genderedUserAge<= Number(searchFilter.ageOption.ageto)
          })
        }
        return genderedUsers
    }
    const filterDistanceUsers = function(filteredAgeUsers){
      if(searchFilter.distanceOption){
         return filteredAgeUsers?.filter(function(filteredAgeUser){
          const location = JSON.parse(filteredAgeUser.custom_json).location
          const distant = distance(location.latitude,location.longitude,userData.location.latitude,userData.location.longitude)
              return distant <= Number(searchFilter.distanceOption)
        })
      }
      return filteredAgeUsers
    }
    const filterPassionUsers = function(filteredDistanceUsers){
      if(searchFilter.passionOption){
        return filteredDistanceUsers?.filter(function(filteredDistanceUser){
              const passions = JSON.parse(filteredDistanceUser.custom_json).passions
            return passions.includes(searchFilter.passionOption)
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
      <SideBarContainer 
        user={user} 
        matchedIds={matchedUserIds} 
        showChat={showChat} 
        setShowChat={setShowChat}
        setShowGroupChat = {setShowGroupChat}
        showGroupsList={showGroupsList}
        setShowGroupsList = {setShowGroupsList}
        setShowInfo={setShowInfo}
        setClickedUser={setClickedUser}
        setSearchFilter={setSearchFilter}
      /> 

      { !showChat &&
          <SwipeMenu 
            filteredMatchedGenderedUsers={filteredMatchedGenderedUsers} 
            updatedMatches = {updatedMatches}
            distance={distance}
            userData={userData}
            updatedNotMatches= {updatedNotMatches}
          />}
        
        { showInfo &&
          <div className="user-info" style={{ fontFamily: "Readex Pro"}}>
              <Userinfo setUserData={setUserData} userData={userData} user={user} setUser={setUser}/>
          </div>
        }
        
        
        <div className={showChat ? "chatengine show-chat":"chatengine"} style={{ fontFamily: "Readex Pro"}}>
        <ChatEngine 
                  offset={+7}
                  height="100vh"
                  projectID="9634dd60-e53b-4d63-a793-711552089ad4"
                  userName={cookies.UserName}
                  userSecret={cookies.UserSecret}
                  renderNewChatForm={(creds) => {}}
                  renderChatHeader={(chat) => chat ? <ChatHeader clickedUser={clickedUser} setShowChat={setShowChat} chat={chat}/> :null}
                  renderChatSettingsTop={(creds, chat) => chat ? <ChatSettings 
                                                            creds={creds}
                                                            setShowChat={setShowChat}
                                                            chat={chat}
                                                            userData={userData} 
                                                            setUserData={setUserData}
                                                            setMatchedUserIds={setMatchedUserIds} 
                                                            clickedUser={clickedUser} 
                                                            setClickedUser={setClickedUser}  
                                                          /> :null}
              />
       </div>

       { showGroupChat ?
       <div className={showGroupChat ? "chatengine show-groups":"chatengine"} style={{ fontFamily: "Readex Pro"}}>
        <ChatEngine 
                  offset={+7}
                  height="100vh"
                  projectID="9634dd60-e53b-4d63-a793-711552089ad4"
                  userName={cookies.UserName}
                  userSecret={cookies.UserSecret}
                  renderChatHeader={(creds) => {}}
              />
       </div> : null
       }
    </div>}
   
    </div>
  );
};

export default Dashboard;
