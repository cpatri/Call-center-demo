import React, { Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Phone from 'material-ui/svg-icons/communication/phone';

const muiTheme = getMuiTheme();

class RightPageInfo extends Component {

  render() {
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
                primaryText={`Name: ${this.props.customerInfo[this.props.activeUser].name}`}
              />
              <ListItem
                disabled={true}
                primaryText= {`Country: ${this.props.customerInfo[this.props.activeUser].country}`}
              />
              <ListItem
                disabled={true}
                primaryText= {`State: ${this.props.customerInfo[this.props.activeUser].state}`}
              />
              <ListItem
                disabled={true}
                primaryText= {`City: ${this.props.customerInfo[this.props.activeUser].city}`}
              />
              <ListItem
                disabled={true}
                primaryText= {`Caller type: ${this.props.customerInfo[this.props.activeUser].callerType}`}
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
  return {
    activeUser: state.center.activeUser,
    customerInfo: state.center.customerInfo,
  }
}
export default connect(mapStateToProps)(RightPageInfo);
