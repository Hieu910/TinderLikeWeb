import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Typography, InputBase, Box, Hidden } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import logo from "../images/white-logo.png"

import { useNavigate } from 'react-router-dom';

const ExploreHeader = ({ onPlaceChanged, onLoad }) => {
 
  let navigate = useNavigate();
  const returnToDashboard = ()=>{
    navigate("/dashboard");
    window.location.reload();
  } 
  return (
    <AppBar position="static">
      <Toolbar className="toolbar">
        <div onClick={returnToDashboard} className="logo-container">
                <img alt="logo" className="logo" src={logo} />
            </div>
        <Box display="flex">
          <Hidden only="xs">
          <Typography variant="h6" className="header-title">
            Explore new places
          </Typography>
          </Hidden>
          <Autocomplete className='header-search-container' onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <div className="header-search">
              <div className="header-search-icon">
                <SearchIcon />
              </div>
              <InputBase placeholder="Search…" className='header-search-input' />
            </div>
          </Autocomplete>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ExploreHeader;
