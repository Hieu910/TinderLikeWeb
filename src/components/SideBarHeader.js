import { BiLogOut } from 'react-icons/bi';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import {IoSettingsSharp} from "react-icons/io5"
import {MdTravelExplore} from "react-icons/md"
import {IoSearch} from "react-icons/io5"
import SearchSettings from './SearchSettings';
import { UserContext } from "../context/UserContext"
import { HeaderContext } from '../context/HeaderContext';
import { useContext, useState } from "react";
const SideBarHeader = () => {
    const [cookies,setCookie,removeCookie] = useCookies(['user'])
    const [showSearch, setShowSearch] = useState(false)

    const{user} = useContext(UserContext)
    const {setShowInfo} = useContext(HeaderContext)

    let navigate = useNavigate()
    const logout = ()=>{
        removeCookie('UserId',cookies.UserId)
        removeCookie('AuthToken',cookies.AuthToken)
        removeCookie('UserName',cookies.UserName)
        removeCookie('UserSecret',cookies.UserSecret)
        navigate ('/')
        window.location.reload()
    }
    const toggleInfo = ()=>{
        setShowInfo((prevValue)=>!prevValue)
    }
    const toggleSearch = ()=>{
        setShowSearch((prevValue)=> !prevValue)
    }
    const goToExplore = ()=>{
        navigate ('/explore')
        window.location.reload()
    }
    return (
        <div className="sidebar-container-header">
           <div className="profile">
                <div className="avatar-container skeleton"style={{ backgroundImage: "url(" + user.avatar + ")", backgroundSize:"cover",backgroundPosition:"center" }}>
                </div>
                <h3>{user.first_name + " " + (user.last_name || '') }</h3>
           </div>
           <div className="icon-container" onClick={goToExplore}><MdTravelExplore className='explore-icon'/></div>
           <div className="icon-container" onClick={toggleInfo}><IoSettingsSharp className='setting-icon'/></div>
           <div className="icon-container" onClick={toggleSearch}><IoSearch className='search-icon'/></div>
           {showSearch && <SearchSettings/>}
            <GoogleLogout 
                className="log-out-icon"
                clientId={process.env.REACT_APP_CLIENT_ID}
                buttonText={<BiLogOut />}
                onLogoutSuccess={logout}
                icon={false}
            />
      
        </div>
    )
}

export default SideBarHeader