import { UserContext } from "../context/UserContext"
import { useContext, useEffect, useState } from "react";
import { useCookies, Cookies } from "react-cookie";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import passions from "../data/passions";
import {  updateUser } from '../api/chatengineAPI';

const Userinfo = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const userId = cookies.UserId;
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [customJson, setCustomJson] = useState("");

  const {user, userData,setUser,setUserData} = useContext(UserContext)


  useEffect(()=>{
      setCustomJson(userData)
      setName({
        first_name: user.first_name,
        last_name: user.last_name
      })
      setPreview(user.avatar)
      setEmail(user.email)
  },[userData])

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
  const handleEmail = (e) => {
    let value = e.target.value;
    setEmail(value) 
  };
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
  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    setCustomJson((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
 const handleSubmit = (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
      alert("You have entered an invalid email address!");
      return
    }
    let formdata = new FormData();
    formdata.append("custom_json", JSON.stringify(customJson))
    if(avatar){
      formdata.append("avatar", avatar, avatar.name)
    }
    formdata.append("first_name", name.first_name)
    formdata.append("last_name", name.last_name)
    formdata.append("email", email)
    try {
        updateUser(userId,formdata)
        .then((res) => {
          setUser(res.data)
          setUserData(JSON.parse(res.data.custom_json))
          alert("update info success")
        })
        .catch((err) => {
          console.log(err)
          alert("fail to update info")
        });
    } catch (err) {
      alert("fail to update info")
      console.log(err)
    }
  };
  return (
      <div className="onboarding update-info">
        <h2>Update account info</h2>
        <form onSubmit={handleSubmit}>
          <section>
          <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              placeholder="Email"
              onChange={handleEmail}
            />
            <label htmlFor="first_name">First name</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={name.first_name}
              placeholder="First Name"
              onChange={handleName}
            />
            <label htmlFor="last_name">Last name</label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              value={name.last_name}
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
                value={customJson.dob_day}
                placeholder="DD"
                onChange={handleChange}
              />
              <input
                id="dob_month"
                type="number"
                min="1" max="12"
                name="dob_month"
                value={customJson.dob_month}
                placeholder="MM"
                onChange={handleChange}
              />
              <input
                id="dob_year"
                type="number"
                min="1" max="2022"
                name="dob_year"
                value={customJson.dob_year}
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
                checked={customJson.gender_identity === "man"}
                value="man"
              />
              <label htmlFor="man">Man</label>
              <input
                id="woman"
                type="radio"
                name="gender_identity"
                onChange={handleChange}
                checked={customJson.gender_identity === "woman"}
                value="woman"
              />
              <label htmlFor="woman">Woman</label>
              
            </div>

            <label htmlFor="show-gender">Show gender on my profile</label>
            <input
              id="show-gender"
              type="checkbox"
              name="show_gender"
              checked={customJson.show_gender}
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
                checked={customJson.gender_interest === "man"}
              />
              <label htmlFor="man-interest">Man</label>
              <input
                id="woman-interest"
                type="radio"
                name="gender_interest"
                onChange={handleChange}
                value="woman"
                checked={customJson.gender_interest === "woman"}
              />
              <label htmlFor="woman-interest">Woman</label>
              <input
                id="everyone-interest"
                type="radio"
                name="gender_interest"
                value="everyone"
                onChange={handleChange}
                checked={customJson.gender_interest === "everyone"}
              />
              <label htmlFor="everyone-interest">Everyone</label>
            </div>
          </section>

          <section>
            <label htmlFor="about">Avatar</label>
            <input
              type="file"
              name="url"
              id="url"
              onChange={handleAvatar}
            />
            <div className="photo-container">
              
                <div
                  style={{ backgroundImage: "url(" + preview + ")" }}
                  className="preview-avatar"
                ></div>
            
            </div>
          </section>
          <section className="options">
            <h4 className="options-title">OPTIONS</h4>
            <label htmlFor="about">About me</label>
            <input
              id="about"
              type="text"
              name="about"
              value={customJson.about}
              placeholder="I like watching Gumball.."
              onChange={handleChange}
            />
            <label htmlFor="about">Passions</label>
            <Select
              placeholder="select 5"
              value={ customJson.passions ? passions.filter(obj => customJson.passions.includes(obj.value)): null}
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
              options={ customJson.passions ? customJson.passions.length <5 ? passions: []:null}
            />
            <button type="submit">Save</button>
          </section>
        </form>
      </div>

  );
};

export default Userinfo
