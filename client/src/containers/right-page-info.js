import React, { Component } from 'react';
import { connect } from 'react-redux';


import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Phone from 'material-ui/svg-icons/communication/phone';
/*const RightPageInfo = () => {
  return <input/>;
}; */
const muiTheme = getMuiTheme();

class RightPageInfo extends Component {

  render() {
    console.log(this.props.activeUser);
    if (!(this.props.activeUser)){
      return null;
    }
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper>
          <List>
              <ListItem 
                disabled={true}
                style= {{ fontSize:'20px'}}
                primaryText="About this customer"
               />
              <Divider />
              <ListItem 
                disabled={true}
                primaryText= {this.props.activeUser}
                leftAvatar= {<Avatar src={`https://api.adorable.io/avatars/255/${this.props.activeUser}@adorable.png`} />}
              />
              <Divider />
              <ListItem
                disabled={true}
                primaryText="Name: Caroline Liongosari"
              />
              <ListItem
                disabled={true}
                primaryText= "Location: San Jose, CA"
              />
              <Divider />
              <ListItem 
                primaryText="Call this customer"
                leftIcon={<Phone/>}
              />
              

          </List>
        </Paper>
      </MuiThemeProvider>
    )

  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    activeUser: state.center.activeUser,
  }
}
export default connect(mapStateToProps)(RightPageInfo);
