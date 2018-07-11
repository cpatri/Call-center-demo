import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {drawerOpen: false};
  }
  render() {

    //if (this.state.drawerOpen) {
    //  content
    //}
    return(
      <div>
        <AppBar
          title="Impekable"
          iconElementLeft = { <IconButton onClick={ this.onMenuButtonClick } > <Menu/> </IconButton> }
        />

        <Drawer open= {this.state.drawerOpen}>
          <IconButton onClick={this.onCloseButtonClick}>
            <ChevronLeft/>
          </IconButton>

          <MenuItem> MenuItem 1 </MenuItem>
          <MenuItem> MenuItem 2 </MenuItem>

        </Drawer>
        
      </div>
    );
  }


  //this event handler is triggered when the menu button is clicked
  onMenuButtonClick = () => this.setState({drawerOpen: true})

  onCloseButtonClick = () => this.setState({drawerOpen: false})



}

export default NavBar;
