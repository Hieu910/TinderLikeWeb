import { BiLogOut } from 'react-icons/bi';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import {IoSettingsSharp} from "react-icons/io5"
import {MdTravelExplore} from "react-icons/md"
import {IoSearch} from "react-icons/io5"
import SearchSettings from './SearchSettings';
import { useState } from 'react';

const SideBarHeader = ({user,setSearchFilter,setShowInfo}) => {
    const [cookies,setCookie,removeCookie] = useCookies(['user'])
    const [showSearch, setShowSearch] = useState(false)

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
        showSearch ? setShowSearch(false) :setShowSearch(true)
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
           {showSearch && <SearchSettings setSearchFilter={setSearchFilter}/>}
            <GoogleLogout 
                className="log-out-icon"
                clientId="734058757713-h2l0k7cpp493k6e5tvtlnlr2vi77fdql.apps.googleusercontent.com"
                buttonText={<BiLogOut />}
                onLogoutSuccess={logout}
                icon={false}
            />
      
        </div>
    )
}

export default SideBarHeader