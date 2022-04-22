/* eslint-disable consistent-return */
import axios from 'axios';

export const getUserDetail = async (name,Id) => {

        const data = await axios.get('https://api.chatengine.io/users/me/',{
            headers:{
                "Project-ID": process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID,
                "User-Name" : name,
                "User-Secret": Id,
            }
        })

        return data
    
};
export const getAllUsers = async (name,Id) => {
    try {
      const data = await axios.get("https://api.chatengine.io/users/",{
        headers:{
            "PRIVATE-KEY":process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY
        }
        })
      return data;
    } catch (error) {
      console.log(error);
    }
};
export const createUser = async (formdata) => {
   try{
    const data = await axios.post("https://api.chatengine.io/users",formdata,{headers:{"PRIVATE-KEY": process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY }})
    return data;
   }
   catch (error) {
    console.log(error);
  }
};
export const getOrCreateUser = async (formdata) => {
    try {
      
      const data = await axios.put("https://api.chatengine.io/users",formdata,{
        headers:{
            "PRIVATE-KEY": process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY
        }})
      return data;
    } catch (error) {
      console.log("err",error);
    }
};
export const getUserById = async (userId) => {
    try {
      
      const data =  await axios.get(`https://api.chatengine.io/users/${userId}/`,{
        headers:{
            "PRIVATE-KEY":process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY
        }
        })
      return data;
    } catch (error) {
      console.log("err",error);
    }
};
export const getUserSession = async (userName,password) => {
    try {
      const data = await axios.get('https://api.chatengine.io/users/me/session/',{
        headers:{
            "Project-ID" :process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID,
            "User-Name" : userName,
            "User-Secret": password,
        }
        })
      return data;
    } catch (error) {
      console.log(error);
    }
};

export const updateUser = async (userId,formdata) => {
    try {
      const data =await axios.patch(`https://api.chatengine.io/users/${userId}/`, formdata, {headers:{"PRIVATE-KEY":process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY}})
      return data;
    } catch (error) {
      console.log(error);
    }
};

export const getAllChats = async (userName,userSecret) => {
    try {
      const data =  await axios.get(`https://api.chatengine.io/chats/`,{
        headers:{"Project-ID":process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID,"User-Name":userName,"User-Secret":userSecret}
       })
      return data;
    } catch (error) {
      console.log(error);
    }
};
export const getOrCreateChat = async (userName,userSecret,formdata) => {
    try {
      const data = await axios.put(`https://api.chatengine.io/chats/`, formdata, {
        headers:{"Project-ID":process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID,"User-Name":userName,"User-Secret":userSecret}
       })
      return data;
    } catch (error) {
      console.log(error);
    }
};
export const createGroupChat = async (userName,userSecret,formdata) => {
    try {
      const data = await axios.post(`https://api.chatengine.io/chats/`, formdata, {
        headers:{"Project-ID":process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID, "User-Name":userName,"User-Secret":userSecret}
       })
      return data;
    } catch (error) {
      console.log(error);
    }
};
