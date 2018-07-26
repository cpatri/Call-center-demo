import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import Explore from 'material-ui/svg-icons/action/explore';
import Layers from 'material-ui/svg-icons/maps/layers';
import Notifications from 'material-ui/svg-icons/social/notifications';
import Book from 'material-ui/svg-icons/action/book';
import Visibility from 'material-ui/svg-icons/action/visibility';
import GoldenLayoutWrapper from './layout';
import Avatar from 'material-ui/Avatar';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerOpen: false };
  }

  // this event handler is triggered when the menu button is clicked
  onMenuButtonClick = () => this.setState({ drawerOpen: !this.state.drawerOpen })

  render() {
    const contentStyle = {
      transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)',
    };
    const forceNavDown = { top: '64px' };
    if (this.state.drawerOpen) {
      contentStyle.marginLeft = 75;
    }
    return (
      <div>
        <AppBar
          title="Impekable"
          iconElementLeft={
            <IconButton onClick={this.onMenuButtonClick} >
              <Menu />
            </IconButton>
          }
          iconElementRight={
            <Avatar
              src='https://avatars2.githubusercontent.com/u/19522672?s=460&v=4'
              size={50} />
          }
        />

        <Drawer
          open={this.state.drawerOpen}
          transitionDuration={450}
          containerStyle={forceNavDown}
          width={75}
        >
          <MenuItem> <IconButton> <Explore /> </IconButton> </MenuItem>
          <MenuItem> <IconButton> <Layers /> </IconButton> </MenuItem>
          <MenuItem> <IconButton> <Notifications /> </IconButton> </MenuItem>
          <MenuItem> <IconButton> <Visibility /> </IconButton> </MenuItem>
          <MenuItem> <IconButton> <Book /> </IconButton> </MenuItem>

        </Drawer>

        <div style={contentStyle} >
          <GoldenLayoutWrapper />
        </div>
      </div>
    );
  }

}

export default NavBar;
