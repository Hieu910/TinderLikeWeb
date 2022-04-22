import GroupsDisplay from "./GroupsDisplay"
import MatchesDisplay from "./MatchesDisplay"
import SideBarHeader from "./SideBarHeader"

const SideBarContainer = ({ user, matchedIds,showChat,setShowChat,showGroupsList,setShowGroupsList,setShowGroupChat,setShowInfo,setClickedUser,setSearchFilter}) => {
    

    return (
        <div className="sidebar-container">
            <SideBarHeader user={user} setSearchFilter={setSearchFilter} setShowInfo={setShowInfo}/>
            <div className="options-container">
                <button className="option" onClick={()=>{setShowChat(false);setShowGroupsList(false)}}>Matches</button>
                <button className="option" disabled={!showChat}>Chats</button>
                <button className="option" onClick={()=>{setShowGroupsList((prevValue)=>!prevValue); setShowGroupChat(false)}}>Groups</button>
            </div>
            {showGroupsList ? <GroupsDisplay setShowChat={setShowChat} setShowGroupChat={setShowGroupChat} />
            :<MatchesDisplay matches={matchedIds} setShowChat={setShowChat}  setShowGroupChat={setShowGroupChat} showChat={showChat} setClickedUser={setClickedUser}/>}
        </div>
    )
}

export default SideBarContainer