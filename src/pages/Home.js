import Nav from "../components/Nav"
import { useState } from "react"
import AuthModal from "../components/AuthModal"
import { useCookies } from "react-cookie"
import { useNavigate } from 'react-router-dom'
import {  getUserById } from '../api/chatengineAPI';

const Home = () => {

const [showModal, setShowModal] = useState(false)
const [isSignUp,setIsSignUp] =useState(true)
const [cookies ,setCookie ,removeCookie] = useCookies(["user"])
const authToken = cookies.AuthToken
let navigate = useNavigate()

const handleClick = () => {
    setShowModal(true)
    setIsSignUp(true)
}
const logout = ()=>{
    removeCookie('UserId',cookies.UserId)
    removeCookie('AuthToken',cookies.AuthToken)
    removeCookie('UserName',cookies.UserName)
    removeCookie('UserSecret',cookies.UserSecret)
    window.location.reload()
}
const checkUserInfo = async()=>{
    try{
        const userId = cookies.UserId
      getUserById(userId)
      .then((response)=>{
        if(response.data.first_name===""){
            navigate("/onboarding")
            window.location.reload()
        } 
        else{
            navigate("/dashboard")
            window.location.reload()
        }
      })
      }
      catch (err){
          console.log(err)
      }
}
    return (
        <div className="overlay">
        <Nav minimal={false} 
            authToken= {authToken}
            setShowModal={setShowModal} 
            showModal={showModal}
            setIsSignUp = {setIsSignUp}
        />
        <div className="home">
            <h1 className="primary-title">Swipe Right</h1>
            {authToken && <button className="primary-button" onClick={checkUserInfo}>Go to Dashboard</button>}
            {authToken && <button className="primary-button" onClick={logout}>Logout</button>}
            {authToken ? null: <button className="primary-button" onClick={handleClick}>
               Create Account
            </button>}
            {showModal && 
            (<AuthModal 
                setShowModal={setShowModal} 
                isSignUp = {isSignUp}
            />)}
        </div>

        </div>
    )
}

export default Home