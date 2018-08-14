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
    if (!this.state.notes) {
      alert('Type some notes!');
    } else {
      //store the notes into firebase under the active user
      const notesRef = firebase.database().ref('notes');
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
                display='block'
                placeholder="Type notes here"
                type="text"
                onChange={this.onInputChange}
                style={noteStyle}
              />
              <RaisedButton
                label="Update Notes"
                className="note-submit"
                style={buttonStyle}
                onClick={this.onFormSubmit}
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
    height: '100px',
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
    notes: state.center.notes,
  }
}
export default connect(mapStateToProps)(RightPageInfo);
