import { useState, createContext } from "react"

const HeaderContext = createContext()

const HeaderProvider= ({children})=>{

    const [showInfo, setShowInfo] = useState(false)
    const [searchFilter,setSearchFilter] = useState({}) 

    const value = {
        showInfo,
        searchFilter,
        setSearchFilter,
        setShowInfo
    }
    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    )
}

export { HeaderContext , HeaderProvider }