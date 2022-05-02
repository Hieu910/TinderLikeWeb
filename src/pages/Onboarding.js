import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { useCookies, Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import passions from "../data/passions";
import  validateEmail  from '../api/validateEmailAPI'
import {  updateUser } from '../api/chatengineAPI';
import { CircularProgress } from '@material-ui/core';
const Onboarding = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const authToken = cookies.AuthToken;
  const userId = cookies.UserId;
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");
  const [email, setEmail] = useState("");
  const [allowLocation, setAllowtLocation] = useState(false);
  const [loading,setLoading] =useState (false)
  const [name, setName] = useState({
    first_name: "",
    last_name: "",
  });
  const [customJson, setCustomJson] = useState({
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    gender_interest: "woman",
    about: "",
    matches: [],
    not_matches:[],
    passions:[],
    location:{}
  });

  let navigate = useNavigate();

  const getCoordinates = (position)=>{
    const lat = position.coords.latitude;
    const long = position.coords.longitude
    reverseGeocodeCoordinates(lat,long)
  }
  const reverseGeocodeCoordinates= (lat,long)=>{
      fetch(`http://api.positionstack.com/v1/reverse?access_key=${process.env.REACT_APP_MY_ACCESS_KEY}&query=${lat},${long}&limit=1`)
      .then(response => response.json())
      .then((datas)=>{
          const {data:[location]} = datas
          const {latitude,longitude,county,country,region} = location
          setCustomJson((prevValue) => {
            return {
              ...prevValue,
              "location": location ? {latitude,longitude,county,country,region} : {}
            };
          });
          setAllowtLocation(true)
      }) 
      .catch(error => console.log(error))
  }
  const handleLocation = ()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(getCoordinates,handleLocationError)
    }
    else {
     alert("Geolocation is not supported by this browser. Please choose another browser");
   }
  }
  function handleLocationError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("Please allow location access to proceed ahead")
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.")
        break;
      default:
    }
  }


  const handleAvatar = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setAvatar(file);
  };

  const handleSelect = (e) => {
    setCustomJson((prevValue) => {
      return {
        ...prevValue,
        "passions": Array.isArray(e) ? e.map(x => x.value) : []
      };
    });
  }

  const handleName = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    setName((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleEmail = (e) => {
    let value = e.target.value;
    setEmail(value) 
  };
  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
   
    setCustomJson((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    validateEmail(email)
    .then((res)=>{
      if(res.state !== "deliverable"){
        setLoading(false)
        alert("You have entered an invalid email address!")
        return
      }
      let formdata = new FormData();
      formdata.append("custom_json", JSON.stringify(customJson))
      formdata.append("avatar", avatar, avatar.name);
      formdata.append("first_name", name.first_name);
      formdata.append("last_name", name.last_name);
      formdata.append("email", email);
      try {
        updateUser(userId,formdata)
          .then((res) => {
            navigate("/dashboard")
            window.location.reload()
          })
          .catch((err) => {
            setLoading(false)
            console.log(err)
          });
      } catch (err) {
        setLoading(false)
        console.log(err)
      }
    })
    .catch((err)=>{
      setLoading(false)
      console.log(err)
    })

  };

  useEffect(() => {
    if (!authToken) {
      navigate("/")
      window.location.reload()
    }
    handleLocation()
  }, []);

  return (
    <div>
     {loading && <div className="loading"><CircularProgress color='secondary' size="5rem" /></div>}
      <Nav minimal={true}/>
      <div className="onboarding">
        <h2>CREATE ACCOUNT</h2>
        <form onSubmit={handleSubmit}>
          <section>
          <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              name="email"
              required
              value={email}
              placeholder="Email"
              onChange={handleEmail}
            />
            <label htmlFor="first_name">First name</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              required
              value={name?.first_name}
              placeholder="First Name"
              onChange={handleName}
            />
            <label htmlFor="last_name">Last name</label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              value={name?.last_name}
              placeholder="Last Name"
              onChange={handleName}
            />
            <label htmlFor="dob_day">Birthday</label>
            <div className="row-input-container">
              <input
                id="dob_day"
                type="number"
                name="dob_day"
                min="1" max="31"
                value={customJson?.dob_day}
                required
                placeholder="DD"
                onChange={handleChange}
              />
              <input
                id="dob_month"
                type="number"
                min="1" max="12"
                name="dob_month"
                required
                value={customJson?.dob_month}
                placeholder="MM"
                onChange={handleChange}
              />
              <input
                id="dob_year"
                type="number"
                min="1" max="2022"
                name="dob_year"
                value={customJson?.dob_year}
                required
                placeholder="YYYY"
                onChange={handleChange}
              />
            </div>

            <label htmlFor="gender">Gender</label>
            <div className="row-input-container">
              <input
                id="man"
                type="radio"
                name="gender_identity"
                onChange={handleChange}
                checked={customJson?.gender_identity === "man"}
                value="man"
              />
              <label htmlFor="man">Man</label>
              <input
                id="woman"
                type="radio"
                name="gender_identity"
                onChange={handleChange}
                checked={customJson?.gender_identity === "woman"}
                value="woman"
              />
              <label htmlFor="woman">Woman</label>
              
            </div>

            <label htmlFor="show-gender">Show gender on my profile</label>
            <input
              id="show-gender"
              type="checkbox"
              name="show_gender"
              checked={customJson?.show_gender}
              onChange={handleChange}
            />

            <label>Show Me</label>
            <div className="row-input-container">
              <input
                id="man-interest"
                type="radio"
                name="gender_interest"
                onChange={handleChange}
                value="man"
                checked={customJson?.gender_interest === "man"}
              />
              <label htmlFor="man-interest">Man</label>
              <input
                id="woman-interest"
                type="radio"
                name="gender_interest"
                onChange={handleChange}
                value="woman"
                checked={customJson?.gender_interest === "woman"}
              />
              <label htmlFor="woman-interest">Woman</label>
              <input
                id="everyone-interest"
                type="radio"
                name="gender_interest"
                value="everyone"
                onChange={handleChange}
                checked={customJson?.gender_interest === "everyone"}
              />
              <label htmlFor="everyone-interest">Everyone</label>
            </div>
          </section>

          <section>
            <label htmlFor="about">Profile Picture</label>
            <input
              type="file"
              name="url"
              id="url"
              onChange={handleAvatar}
              required
            />
            <div className="photo-container">
              {avatar && (
                <div
                  style={{ backgroundImage: "url(" + preview + ")" }}
                  className="preview-avatar"
                ></div>
              )}
            </div>
          </section>
          <section className="options">
            <h4 className="options-title">OPTIONS</h4>
            <label htmlFor="about">About me</label>
            <input
              id="about"
              type="text"
              name="about"
              value={customJson?.about}
              placeholder="I like watching Gumball.."
              onChange={handleChange}
            />
            <label htmlFor="about">Passions</label>
            <Select
              placeholder="select 5"
              value={passions?.filter(obj => customJson?.passions?.includes(obj.value))}
              closeMenuOnSelect={false}
              onChange={handleSelect}
              components={makeAnimated()}
              isMulti
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "black",
                },
              })}
              options={customJson?.passions?.length <5 ? passions: []}
            />
            <button disabled={!allowLocation} type="submit">Submit</button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
