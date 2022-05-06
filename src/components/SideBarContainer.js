import { useContext, useState } from "react"
import GroupsDisplay from "./GroupsDisplay"
import MatchesDisplay from "./MatchesDisplay"
import SideBarHeader from "./SideBarHeader"
import { ChatContext } from "../context/ChatContext"
import { UserContext } from "../context/UserContext"

const SideBarContainer = () => {
    
    const [showGroupsList,setShowGroupsList] =useState(false)
    const {showChat,setShowChat,setShowGroupChat,showSideMenu,setShowSideMenu} = useContext(ChatContext)
    const {setClickedUser} = useContext(UserContext)

    const toggleGroupsDisplay = ()=>{
        setShowGroupsList((prevValue)=>!prevValue);
        setShowGroupChat(false);
        setShowChat(false);
        setClickedUser(null) 
    }
    const toggleMatchesDisplay = ()=>{
        setShowChat(false);
        setClickedUser(null);
        setShowGroupsList(false)
    }
    return (
        <div  className={showSideMenu ? "sidebar-container show": "sidebar-container"}>
            <SideBarHeader/>
            <div className="options-container">
                <button className="option" onClick={toggleMatchesDisplay}>Matches</button>
                <button className="option" disabled={!showChat}>Chats</button>
                <button className="option" onClick={toggleGroupsDisplay}>Groups</button>
            </div>
            {showGroupsList ? <GroupsDisplay />
            :<MatchesDisplay />}
            <div onClick={()=>{setShowSideMenu(false)}} className="close-sidebar hide-on-pc"><p>Close</p></div>
        </div>
    )
}

export default SideBarContainer