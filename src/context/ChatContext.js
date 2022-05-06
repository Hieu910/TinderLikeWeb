import { useState, createContext } from "react"

const ChatContext = createContext()

const ChatProvider= ({children})=>{

    const [showChat, setShowChat] = useState(false)
    const [showGroupChat,setShowGroupChat] =useState(false)
    const [showSideMenu, setShowSideMenu] = useState(false)
    const [isFirstRender, setIsFirstRender] = useState(false)
    const [directChatId,setDirectChatId] = useState(null)
    const [groupChatId,setGroupChatId] = useState(null)

    const value = {
        showChat,
        showGroupChat,
        showSideMenu,
        isFirstRender,
        directChatId,
        groupChatId,
        setShowChat,
        setShowSideMenu,
        setIsFirstRender,
        setShowGroupChat,
        setDirectChatId,
        setGroupChatId
    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContext , ChatProvider }