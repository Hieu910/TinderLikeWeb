
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useCookies } from "react-cookie"
import { GoogleLogin } from "react-google-login"
import FacebookLogin from 'react-facebook-login';
import { FaFacebook } from "react-icons/fa"
import { CircularProgress } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { FaTimes } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {  getUserDetail, getOrCreateUser,createUser,getUserSession } from '../api/chatengineAPI';

const AuthModal = ({setShowModal , isSignUp}) => {
    const [userName,setUserName] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] =useState(null)
    const [error,setError] = useState(null)
    const [cookies , setCookie, removeCookie ] =useCookies(null)
    const [isClicked ,setIsClicked] = useState(false)
    const [loading,setLoading] =useState (false)
    const [showPassword,setShowPassword] =useState (false)
    const [showConfirmPassword,setShowConfirmPassword] =useState (false)
    let navigate = useNavigate()
    const handleClick = () => {
        setShowModal(false)
    }
    function removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); 
        str = str.replace(/ + /g," ");
        str = str.trim();
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        return str;
    }
    const onLoginFailure = (res) => {
        if(isClicked){
            setLoading(false)
            setError("Email already registered, please use another email!")
            return
        }
        setIsClicked(true)
    };

    const onLoginSuccess = (res) => {
        setLoading(true)
        const name=  removeVietnameseTones(res.graphDomain ? res.name : res.profileObj.name)
        const Id = res.graphDomain ? res.id : res.profileObj.googleId
        const email = res.graphDomain ? res.email : res.profileObj.email
        const accessToken = res.accessToken
        getUserDetail(name,Id)
        .then(()=>{
            
            let formdata = new FormData()
            formdata.append("username", name);
            formdata.append("secret", Id);
            
            getOrCreateUser(formdata)
            .then((foundUser)=>{
                setCookie("AuthToken",accessToken)
                setCookie("UserId", foundUser.data.id)
                setCookie("UserName",name)
                setCookie("UserSecret", Id)
                navigate ('/dashboard')
                window.location.reload()
            })
        })
        .catch((err)=>{
         
            let formdata = new FormData()
            formdata.append("username", name);
            formdata.append("secret", Id);
            formdata.append("email", email);
            createUser(formdata)
            .then((user)=> {
                setCookie("AuthToken",accessToken)
                setCookie("UserId", user.data.id)
                setCookie("UserName", name)
                setCookie("UserSecret", Id)
                navigate ('/onboarding')
                window.location.reload()
            })
            .catch((error)=> {
                setLoading(false)
                setError(`User name "${name}" already registered`)
                console.log(error)
                return
            })
        })        
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    const handleClickShowPassword = () => {
        setShowPassword((prevValue)=>!prevValue);
      };
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
      };
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword((prevValue)=>!prevValue);
      };

    const handleSubmit =(e) =>{
        e.preventDefault()
        try {
            setLoading(true)
            if(isSignUp && (password !== confirmPassword)){
                setLoading(false)
                setError("Passwords need to match!")
                return
            }
           getUserDetail(userName,password)
            .then(()=>{
                if(isSignUp){
                    setLoading(false)
                    setError("User name already registered, please Login!")
                    return
                }
                else{
                    let formdata = new FormData()
                    formdata.append("username",userName);
                    formdata.append("secret",password);
                    getOrCreateUser(formdata)
                    .then((user)=>{
                        getUserSession(userName,password)
                        .then((session)=>{
                            setCookie("AuthToken",session.data.token)
                            setCookie("UserId", user.data.id)
                            setCookie("UserName",userName)
                            setCookie("UserSecret", password)
                            navigate ('/dashboard')
                            window.location.reload()
                        })
                    })
                }
            })
            .catch((err)=>{
              
                if(isSignUp){
                    let formdata = new FormData()
                    formdata.append("username",userName);
                    formdata.append("secret",password);
                    createUser(formdata)
                    .then((user)=> {
                        getUserSession(userName,password)
                        .then((session)=>{
                            setCookie("AuthToken",session.data.token)
                            setCookie("UserId", user.data.id)
                            setCookie("UserName",userName)
                            setCookie("UserSecret", password)
                            navigate ('/onboarding')
                            window.location.reload()
                        })
                    })
                    .catch((error)=>{
                        setLoading(false)
                        setError("User name already registered, please Login!")
                        return
                    })
                }
                else{
                    setLoading(false)
                    setError("Invalid user name or password")
                    return
                }
            })
        }
        catch (err){
            console.log(err)
        }
    }
   
    return (
        <div className="modal" onClick={handleClick}>
        <div className="auth-modal" onClick={(e)=>{e.stopPropagation()}}>
            <div className="close-icon-container" onClick={handleClick}><FaTimes className="close-icon" /></div>
            <h2>{isSignUp ? "Create Account" : "Login"}</h2>
            <p>By clicking {isSignUp ? "Create Account" : "Login"} you agree to our terms of service and privacy statement</p>
            <form onSubmit={handleSubmit} autoComplete="off">
          
                    <Grid container spacing={1} className="form-control" alignItems="flex-end" justifyContent="center">
                    <Grid item>
                        <AccountCircle />
                    </Grid>
                    <Grid className="form-input" item>
                        <TextField fullWidth={true} onChange={(e)=>{setUserName(e.target.value)}} className="username-input" id="username" label="User name" />
                    </Grid>
                    </Grid>

                    <Grid container spacing={1} className="form-control" alignItems="flex-end" justifyContent="center">
                    <Grid item>
                        <MdPassword style={{width:"24px",height:"24px"}}/>
                    </Grid>
                    <Grid className="form-input" item>
                    <FormControl fullWidth={true} className="">
                    <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            id="password"
                            className="password-input"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value)}}
                            endAdornment={
                            <InputAdornment className="password-adorment" position="end">
                                <IconButton
                                className="toggle-visibility-icon"
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                     </FormControl>
                    </Grid>
                    </Grid>
                
                {isSignUp && 
                    <Grid container spacing={1} className="form-control" alignItems="flex-end" justifyContent="center">
                    <Grid item>
                        <MdPassword style={{width:"24px",height:"24px"}}/>
                    </Grid>
                    <Grid className="form-input" item>
                    <FormControl fullWidth={true} className="">
                    <InputLabel htmlFor="password-check">Confirm Password</InputLabel>
                        <Input
                            id="password-check"
                            className="password-input"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e)=>{setConfirmPassword(e.target.value)}}
                            endAdornment={
                            <InputAdornment className="password-adorment" position="end">
                                <IconButton
                                className="toggle-visibility-icon"
                                aria-label="toggle password visibility"
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={handleMouseDownConfirmPassword}
                                >
                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                     </FormControl>
                    </Grid>
                    </Grid>
                }
                <p>{error}</p>
                <button className="secondary-button" type="submit">{isSignUp ? "Create": "Login"}</button>
            </form>
                 <GoogleLogin
                    className="gg-login-btn"
                    clientId={process.env.REACT_APP_CLIENT_ID}
                    buttonText="LOGIN WITH GOOGLE"
                    onSuccess={onLoginSuccess}
                    onFailure={onLoginFailure}
                    cookiePolicy={'single_host_origin'}
                />
                <div className="facebook-login-container">
                <FaFacebook className="facebook-login-icon"/>
                <FacebookLogin
                    appId="3233654463547423"
                    autoLoad={false}
                    cssClass="facebook-login-btn"
                    fields="name,email,picture"
                    callback={onLoginSuccess}
                 />
                </div>
                
            <hr />
            <h2>GET YOUR DATE</h2>
        </div>
        {loading && <div className="loading"><CircularProgress color='secondary' size="5rem" /></div>}
        </div>
 
    )
}

export default AuthModal