import React, { Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Phone from 'material-ui/svg-icons/communication/phone';
import RingVolume from 'material-ui/svg-icons/communication/ring-volume';
import RaisedButton from 'material-ui/RaisedButton';

const muiTheme = getMuiTheme();
const device = new Twilio.Device();
class RightPageInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {calling: false};
  }
  render() {
    const { noteStyle, buttonStyle} = styles;
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
                primaryText= {this.state.calling ?  "Hang up": "Call this customer" }
                leftIcon={this.state.calling? <RingVolume/>: <Phone/>}
                onClick= {() => {
                  this.setState({calling: !this.state.calling});
                  if (!this.state.calling)  {
                    getToken(this.props.activeUser); 
                  }
                  else{
                    console.log("Hanging up");
                    device.disconnectAll();
                  }
                }}
              />
              <Divider />
              <ListItem 
                disabled={true}
                primaryText="Notes"
              />
          </List>
          <div id='notes-container'>
            <form >
              <textarea
                display='block'
                placeholder="Type notes here"
                type="text"
                style={noteStyle}
              />
              <RaisedButton
                label="Submit"
                className="note-submit"
                style={buttonStyle}
                primary
              />
            </form>
        </div>
        </Paper>
      </MuiThemeProvider>
    )

  }
}

const styles = {
  noteStyle: {
    width: '100%',
    height: '33vh',
    boxShadow: 'inset 0px 0px 2px #95979b',
    fontWeight: 100,
    fontSize: '16px',
    fontFamily: 'Roboto, sans-serif',
    border: 'none',
    color: 'rgba(0,0,0, 0.87)',
    padding: '10px',
    display: 'block'

  },
  buttonStyle: {
    borderRadius: '2px',
  }

};
function getToken(activeUser) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3003/token', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = () => {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200 && activeUser) {
         setUpCall(activeUser, xhr.responseText);
;      }
    }
  }
  xhr.send(null);  
}

function setUpCall(activeUser, token) {
  device.setup(token);
  device.on('ready', (device) => console.log('Twilio device is now ready for connections'));
  device.on('error', (error) => console.log(error.message));
  device.on('connect', (conn) =>console.log('successfully established call!'));
  callUser(device, activeUser);

}
function callUser(device, activeUser) {
  var params = {
    To: activeUser,
  }
  console.log('Calling ' + params.To + '...');
  device.connect(params); 
}


function mapStateToProps(state) {
  return {
    activeUser: state.center.activeUser,
    customerInfo: state.center.customerInfo,
  }
}
export default connect(mapStateToProps)(RightPageInfo);
