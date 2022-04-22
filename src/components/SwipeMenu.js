import ChatCard from "react-tinder-card";
import { BsGenderMale } from "react-icons/bs"
import { BsGenderFemale } from "react-icons/bs"
import {IoIosClose} from "react-icons/io"
import { IoMdHeart } from "react-icons/io"
const SwipeMenu = ({filteredMatchedGenderedUsers,updatedMatches,distance,userData,updatedNotMatches})=>{

    const showGender = (genderedUserInfo)=>{
        if(genderedUserInfo.show_gender){
          return genderedUserInfo.gender_identity === "man" ? <BsGenderMale className="gender-icon-male"/> : <BsGenderFemale className="gender-icon-female"/> 
      }
      else{
          return null
        }
    }
    const swiped = (direction, swipedUser) => {
    
      if(direction === "right")
      {
        updatedMatches(swipedUser)
      }
      if(direction === "left")
      {
        updatedNotMatches(swipedUser)
      }
  }

    return (
      
        <div className="swipe-container">
          <div className="swipe-dir"> 
                    <IoIosClose className="not-match-icon"/>
                    <span>NOPE</span>
                </div>
        <div className="card-container">
          {filteredMatchedGenderedUsers.length ? 
          filteredMatchedGenderedUsers?.map((genderedUser) =>{
            const genderedUserInfo = JSON.parse(genderedUser.custom_json)
            const location = genderedUserInfo.location
            const passions = genderedUserInfo.passions
            const distant = location ? distance( location.latitude, location.longitude, userData.location.latitude, userData.location.longitude) : null
            return  (
                <ChatCard
                  className="swipe"
                  key={genderedUser.id}
                  onSwipe={(dir) => swiped(dir, genderedUser.id)}
                >
                  <div
                    style={{ backgroundImage: "url(" + genderedUser.avatar + ")" }}
                    className="card"
                  >
                  <div className=""></div>
                  <div className="card-info">
                  <div className="card-header">
                    <h3>{genderedUser.first_name},</h3>
                    <h2>{genderedUserInfo.dob_year ? new Date().getFullYear()-Number(genderedUserInfo.dob_year) : ""}</h2>
                    { 
                        showGender(genderedUserInfo)
                    }
                  </div>
                    <div className="card-content">
                      <div className="card-about">
                        {genderedUserInfo.about && <p>{genderedUserInfo.about}</p>}
                        <p>{distant} kilometers away</p>
                        <p>Live in {location ? genderedUserInfo.location.county + ", "+ genderedUserInfo.location.region:""}</p>
                      </div> 
                      
                      <div className="card-passions">
                        {
                          passions ? genderedUserInfo.passions.map((passion,index)=>{
                              return (
                                <div key={index} className="passion-item">{passion}</div>
                              )
                        }) : null
                        }
                      </div>
                    </div>
                  </div>
               
                  </div>
                </ChatCard>
              
          )} 
         ): <ChatCard className='swipe empty'>
            <div style={{ backgroundImage: 'url(https://w0.peakpx.com/wallpaper/677/966/HD-wallpaper-sad-face-background-black-screen-styles.jpg)' }} className='card'>
              <h3>Sorry, we couldn't find anyone match your interest</h3>
            </div>
            </ChatCard>       
         }
       
         </div>
         <div className="swipe-dir"> 
                        <IoMdHeart className="match-icon"/>
                        <span>MATCH</span>
                </div>
        </div>
        
    )
}

export default SwipeMenu