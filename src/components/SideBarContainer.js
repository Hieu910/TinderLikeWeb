import { useContext, useState } from "react"
import GroupsDisplay from "./GroupsDisplay"
import MatchesDisplay from "./MatchesDisplay"
import SideBarHeader from "./SideBarHeader"
import { ChatContext } from "../context/ChatContext"


const SideBarContainer = () => {
    
    const [showGroupsList,setShowGroupsList] =useState(false)
    const {showChat,setShowChat,setShowGroupChat} = useContext(ChatContext)


    return (
        <div className="sidebar-container">
            <SideBarHeader/>
            <div className="options-container">
                <button className="option" onClick={()=>{setShowChat(false);setShowGroupsList(false)}}>Matches</button>
                <button className="option" disabled={!showChat}>Chats</button>
                <button className="option" onClick={()=>{setShowGroupsList((prevValue)=>!prevValue); setShowGroupChat(false); setShowChat(false) }}>Groups</button>
            </div>
            {showGroupsList ? <GroupsDisplay />
            :<MatchesDisplay />}
        </div>
    )
}

export default SideBarContainer