import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext"
import { ChatContext } from "../context/ChatContext"
import { useCookies } from "react-cookie";
import { IoLocationOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";
import {  updateUser } from '../api/chatengineAPI';
const ChatSettings = ({chat,creds,distance})=>{

    const [cookies, setCookie, removeCookie] = useCookies(["user"])
    const userId  = cookies.UserId

    const { userData,setUserData, clickedUser, setClickedUser,setMatchedUserIds} = useContext(UserContext)
    const {setShowChat } = useContext(ChatContext)

    const [recipientInfo,setRecipientInfo] = useState(null)
    const [recipientAvatar,setRecipientAvatar]= useState("") 
    const [recipientFirstName,setRecipientFirstName]= useState("") 
    const [recipientLastName,setRecipientLastName]= useState("") 
    const [recipientEmail,setRecipientEmail]= useState("") 
    const [recipientAbout,setRecipientAbout]= useState("") 
    const [recipientPassions,setRecipientPassions]= useState([]) 
    const [recipientLocation,setRecipientLocation]= useState("") 
    const [recipientAge,setRecipientAge]= useState("") 
    const userLocation = userData ? userData.location : null
    
    useEffect(()=>{
        if(clickedUser){
            setRecipientInfo(JSON.parse(clickedUser.custom_json))
            setRecipientAvatar(clickedUser.avatar)
            setRecipientFirstName(clickedUser.first_name)
            setRecipientLastName(clickedUser.last_name)
            setRecipientEmail(clickedUser.email)
        } 
      },[clickedUser])
    
    useEffect(()=>{
        if(recipientInfo)
       {
        setRecipientAbout(recipientInfo.about) 
        setRecipientPassions(recipientInfo.passions)
        setRecipientLocation(recipientInfo.location)
        setRecipientAge(new Date().getFullYear() - recipientInfo.dob_year)
       }
    },[recipientInfo])


    const handleDeleteMatch = ()=>{
        const matchIndex = userData ? userData.matches.indexOf(clickedUser.id) :null
        userData.matches.splice(matchIndex,1)
        let formdata = new FormData()
        formdata.append("custom_json",JSON.stringify(userData));
          try{
            updateUser(userId,formdata)
            .then((res)=>{
                setMatchedUserIds(JSON.parse(res.data.custom_json).matches)
                setUserData(JSON.parse(res.data.custom_json))
                setClickedUser(null)
                setShowChat(false)
            })
            .catch((err)=>{
                console.log(err)
            })
          } catch (err){
            console.log(err)
          }
    }
    return (
        
        <div>
            <div className="skeleton" style={{ backgroundImage: "url(" + recipientAvatar + ")", backgroundSize:"cover", backgroundPosition:"center", width:"100%", height:"400px"}} >
    
            </div>
            <div className="recipient-info-container">
            <div className="recipient-info-list">
                <div className="recipient-info-item">
                    <h2>{`${recipientFirstName} ${recipientLastName}   ${recipientAge}`}</h2>
                </div>
                <div className="recipient-info-item">
                    <IoMailOutline className="recipient-info-item-icon"/>
                    <p>Email: {recipientEmail}</p>
                </div>
                <div className="recipient-info-item">
                    <IoHomeOutline className="recipient-info-item-icon"/>
                    <p>Live in {recipientLocation?.county}, {recipientLocation?.region}</p>
                </div>
                <div className="recipient-info-item">
                    <IoLocationOutline className="recipient-info-item-icon"/>
                    <p>{distance(userLocation?.latitude,userLocation?.longitude, recipientLocation.latitude, recipientLocation.longitude)} km away </p>
                </div>
            </div>
            { recipientAbout ?  
                    <div className="recipient-info-item-about">
                        <p>{recipientAbout}</p>
                    </div>
                    : null
                }
                { recipientPassions.length ?  
                    <div className="recipient-info-item-passions">
                        {recipientPassions.map((item,index)=>{
                            return (
                                <div key={index} className="passion-item">{item}</div>
                            )
                        })}
                    </div> 
                    : null
                }
                <div onClick={()=>{ handleDeleteMatch() }} className="unmatched">
                    <p>UNMATCHED</p> 
                </div>
            </div>
        </div>
    )
}

export default ChatSettings