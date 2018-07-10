import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


const NavBar = () => {
  return (
      <div>
        <AppBar className= "app-bar" position="static">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Impekable
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
  );
};

export default NavBar;
