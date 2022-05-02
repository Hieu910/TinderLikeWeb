import { useState,useContext } from "react";
import Select from "react-select";
import Switch from "react-switch";
import passions from "../data/passions";
import { HeaderContext } from '../context/HeaderContext';

const SearchSettings = ()=>{
    
    const [distanceFilter,setDistantFilter] = useState(false)
    const [distance,setDistance] = useState("")
    const [ageFilter,setAgeFilter] = useState(false)
    const [age,setAge] = useState({
        agefrom: 18,
        ageto: 40
    })

    const [passionFilter,setPassionFilter] = useState(false)
    const [passion,setPassion] = useState("")
    const { setSearchFilter } = useContext(HeaderContext)
   

    const handleDistance = ()=>{
        setDistantFilter((prevValue)=>{
            return !prevValue
        })
    }
    const handleAge = ()=>{
        setAgeFilter((prevValue)=>{
            return !prevValue
        })
    }
    const changeAge = (e)=>{
       const name = e.target.name
       const value = e.target.value
        setAge((prevValue)=>{
            return {
                ...prevValue,
                [name]:value
            }
        })
    }
    const handlePassion = ()=>{
        setPassionFilter((prevValue)=>{
            return !prevValue
        })
    }
    const handleSelect = (e)=>{
        e ? setPassion(e.value): setPassion(null);
    }
    const handleClick = ()=>{
        setSearchFilter({
            distanceOption: distanceFilter ? distance: "",
            ageOption: ageFilter ? age: "",
            passionOption: passionFilter ? passion: ""
        })
    }
    return (
            <div className="search-container">
               <div className="search-option">
                    <label htmlFor="age-from">Age from </label>
                    <input disabled={!ageFilter} id="age-from" min="18" max="100" value={age.agefrom} onChange={changeAge} className="age-bar-search" name="agefrom" type="number"></input>
                    <label htmlFor="age-to"> to </label>
                   <input disabled={!ageFilter} id="age-to" min="18" max="100" value={age.ageto} onChange={changeAge} className="age-bar-search" name="ageto" type="number"></input>
                   <label>
                        <Switch onChange={handleAge} checked={ageFilter}/>
                    </label>
               </div>
               <div className="search-option">
                    <label htmlFor="distant">Distance</label>
                   <input disabled={!distanceFilter} id="distant" value={distance} onChange={(e)=>{setDistance(e.target.value)}} className="distance-search" name="distance" type="number"></input>
                   <span>KM</span>
                   <label>
                        <Switch onChange={handleDistance} checked={distanceFilter}/>
                    </label>
               </div>
               <div className="search-option">
               <span>Passion</span>
                    <Select 
                        className="passion-search"
                        onChange={(e)=>{handleSelect(e)}}
                        isClearable
                        isSearchable
                        isDisabled={!passionFilter}
                        options={passions}
                    />
                     <label>
                        <Switch onChange={handlePassion} checked={passionFilter}/>
                    </label>
               </div>
                <div className="search-option save-option">
                <div onClick={handleClick} className="btn primary-button">Search</div>
                </div>
            </div>
    )
}

export default SearchSettings