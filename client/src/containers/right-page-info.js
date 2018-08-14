import React, { Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
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
    this.state = {calling: false, notes: ''};

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }
  onInputChange(event) {
    this.setState({
      notes: event.target.value,
    });
  }
  onFormSubmit(event) {
    event.preventDefault();
      //store the notes into firebase under the active user
      const notesRef = firebase.database().ref('/notes');
      notesRef.child(this.props.activeUser).once("value", snapshot => {
        var newNotesInfo = {
          notes: this.state.notes,
        }
        if(!snapshot.exists()) {
          notesRef.child(this.props.activeUser).set(newNotesInfo);
          this.updateState();
        }
        else {
          var updates = {};
          updates['/notes/'+ this.props.activeUser] = newNotesInfo;
          firebase.database().ref().update(updates);
          this.updateState();
        }
      });

  }
  updateState() {
    this.setState({
      notes: '',
    });
  }
  render() {
    const { noteStyle, buttonStyle} = styles;
    if (!(this.props.activeUser)){
      return null;
    }
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper >
          <div id='paper' style={{overflowY:'auto', height: 'calc(100vh - 84px)'}}>
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
                  primaryText={ 
                    this.props.customerInfo[this.props.activeUser]? 
                    `Name: ${this.props.customerInfo[this.props.activeUser].name}`:
                     null}
                />
                <ListItem
                  disabled={true}
                  primaryText= {
                    this.props.customerInfo[this.props.activeUser] ?
                    `Country: ${this.props.customerInfo[this.props.activeUser].country}`:
                    null }
                />
                <ListItem
                  disabled={true}
                  primaryText= {
                    this.props.customerInfo[this.props.activeUser] ?
                    `State: ${this.props.customerInfo[this.props.activeUser].state}`:
                    null}
                />
                <ListItem
                  disabled={true}
                  primaryText= {this.props.customerInfo[this.props.activeUser] ?
                    `City: ${this.props.customerInfo[this.props.activeUser].city}`:
                    null}
                />
                <ListItem
                  disabled={true}
                  primaryText= {this.props.customerInfo[this.props.activeUser] ?
                    `Caller type: ${this.props.customerInfo[this.props.activeUser].callerType}`:
                    null}
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
                      device.disconnectAll();
                    }
                  }}
                />
                <Divider />
                <ListItem 
                  disabled={true}
                  primaryText='Quick notes:'
                />
                <ListItem 
                  disabled={true}
                  primaryText={this.props.notes ? this.props.notes[this.props.activeUser].notes : null}
                />
            </List>
            <div id='notes-container'>
              <form >
                <textarea
                  rows='4'
                  display='block'
                  placeholder="Type notes here"
                  type="text"
                  onChange={this.onInputChange}
                  style={noteStyle}
                />
                <br/>
                <RaisedButton
                  label="Update Notes"
                  className="note-submit"
                  style={buttonStyle}
                  onClick={this.onFormSubmit}
                  primary
                />
                <br/>
              </form>
            </div>
          </div>   
        </Paper>
      </MuiThemeProvider>
    )

  }
}

const styles = {
  noteStyle: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '95%',
    boxShadow: 'inset 0px 0px 2px #95979b',
    fontWeight: 100,
    fontSize: '16px',
    fontFamily: 'Roboto, sans-serif',
    border: 'none',
    color: 'rgba(0,0,0, 0.87)',
    padding: '10px',



  },
  buttonStyle: {
    display: 'block',
    marginLeft: '2.5%',
    width: '131.6px',
    
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
    notes: state.center.notes,
  }
}
export default connect(mapStateToProps)(RightPageInfo);
