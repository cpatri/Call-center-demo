import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/svg-icons/navigation/menu';

class NavBar extends Component {
  render() {
    return(
      <AppBar
        title="Impekable"
        iconElementLeft = { <IconButton onClick={ this.onMenuButtonClick } > <Menu/> </IconButton> }
      />
    );
  }

  //this event handler is triggered when the menu button is clicked 
  onMenuButtonClick() {
    console.log("Clicked left button");
  }


}

export default NavBar;
