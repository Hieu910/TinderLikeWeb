import { useState, createContext } from "react"

const UserContext = createContext()

const UserProvider= ({children})=>{
    const [user, setUser] = useState({})
    const [userData, setUserData] = useState("")
    const [matchedUserIds, setMatchedUserIds] = useState([])
    const [notMatchedUserIds, setNotMatchedUserIds] = useState([])
    const [clickedUser,setClickedUser] = useState("")


   
    const value = {
        user,
        userData,
        matchedUserIds,
        notMatchedUserIds,
        clickedUser,
        setUserData,
        setUser,
        setMatchedUserIds,
        setNotMatchedUserIds,
        setClickedUser
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext , UserProvider }