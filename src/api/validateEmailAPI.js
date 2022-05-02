import axios from "axios";

 const validateEmail = async (email) => {
    try {
     
        const { data } = await axios.get(`https://api.emailable.com/v1/verify`,{
          params:{
            email: email,
            api_key: process.env.REACT_APP_EMAILABLE_API_KEY
          }
        });
        return data;
    } catch (error) {
      console.log(error);
    }
  };

  // ?email=${email}&api_key=${process.env.REACT_APP_EMAILABLE_API_KEY}
export default validateEmail