import { useState, createContext } from "react"

const ChatContext = createContext()

const ChatProvider= ({children})=>{

    const [showChat, setShowChat] = useState(false)
    const [showGroupChat,setShowGroupChat] =useState(false)
    const [isFirstRender, setIsFirstRender] = useState(false)

    const value = {
        showChat,
        showGroupChat,
        isFirstRender,
        setShowChat,
        setIsFirstRender,
        setShowGroupChat
    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContext , ChatProvider }