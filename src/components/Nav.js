import logo from "../images/white-logo.png"
import colorLogo from "../images/color-logo.png"




const Nav = ({authToken ,minimal, setShowModal, showModal, setIsSignUp}) => {
    const handleClick =() =>{
        setShowModal(true)
        setIsSignUp(false)
    }
    
    return (
        <nav>
            <div className="logo-container">
                <img alt="logo" className="logo" src={minimal ? colorLogo: logo} />
            </div>
            {!authToken && !minimal && <button className="nav-button" disabled={showModal} onClick={handleClick}>Log in</button>}
        </nav>
    )
}

export default Nav