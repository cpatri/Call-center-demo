import React, { Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Phone from 'material-ui/svg-icons/communication/phone';
import RingVolume from 'material-ui/svg-icons/communication/ring-volume';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { showModal } from '../actions/index';
//import Modal from './modal';

const muiTheme = getMuiTheme();
const device = new Twilio.Device();

function getToken(activeUser, handleOpen) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/token', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = () => {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200 && activeUser) {
         setUpConnection(activeUser, xhr.responseText, handleOpen);
      }
    }
  };
  xhr.send(null);
}

function setUpConnection(activeUser, token, handleOpen) {
  device.setup(token);
  device.on('ready', (device) => console.log('Twilio device is now ready for connections'));
  device.on('error', (error) => console.log(error.message));
  device.on('connect', (conn) =>console.log('successfully established call!'));
  device.incoming((conn) => {
    console.log('Incoming connection from ' + conn.parameters.From);
    handleOpen(conn.parameters.From, conn);

  });
}

function callUser(device, activeUser) {
  const params = {
    To: activeUser,
  };
  console.log('Calling ' + params.To + '...');
  device.connect(params);
}

class RightPageInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {open: false, calling: false, notes: '', openedModal: false, incomingCaller: '', connection: false };

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
      // store the notes into firebase under the active user
    const notesRef = firebase.database().ref('/notes');
    notesRef.child(this.props.activeUser).once('value', (snapshot) => {
      const newNotesInfo = {
        notes: this.state.notes,
      };
      if (!snapshot.exists()) {
        notesRef.child(this.props.activeUser).set(newNotesInfo);
        this.updateState();
      }
      else {
        const updates = {};
        updates['/notes/'+ this.props.activeUser] = newNotesInfo;
        firebase.database().ref().update(updates);
        this.updateState();
      }
    });
  }
  updateState() {
    this.setState({ notes: '' });
  }
  handleOpen = (incomingCaller, connection) => {
    this.setState({ open: true, incomingCaller, connection});

  };

  handleClose = () => {
    if (this.state.connection) {
      this.state.connection.reject();
      //this.setState({ rejectCallback: false });
      console.log('rejectCall');
    }
    this.setState({ open: false });
  };

  handleAnswer = () => {
    if (this.state.connection) {
      this.state.connection.accept();
      
    }
  }
  render() {
    const { noteStyle, buttonStyle } = styles;
    const actions = [
      <FlatButton
        label="Decline"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Answer"
        secondary={true}
        onClick={this.handleAnswer}
      />,
    ];
    if (!(this.props.activeUser)) {
      return null;
    }
    getToken(this.props.activeUser, this.handleOpen);
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper >
          <div id='paper' style={{ overflowY: 'auto', height: 'calc(100vh - 84px)' }}>
            <List>
              <ListItem 
                disabled={true}
                style={{ fontSize: '20px' }}
                primaryText="About this customer"
              />
              <Divider />
              <ListItem
                disabled={true}
                primaryText={this.props.activeUser}
                leftAvatar={<Avatar src={`https://api.adorable.io/avatars/255/${this.props.activeUser}@adorable.png`} />}
              />
              <Divider />
              <ListItem
                disabled={true}
                primaryText={ 
                  this.props.customerInfo[this.props.activeUser] ?
                  `Name: ${this.props.customerInfo[this.props.activeUser].name}` :
                    null}
              />
              <ListItem
                disabled={true}
                primaryText={
                  this.props.customerInfo[this.props.activeUser] ?
                  `Country: ${this.props.customerInfo[this.props.activeUser].country}` :
                  null}
              />
              <ListItem
                disabled={true}
                primaryText= {
                  this.props.customerInfo[this.props.activeUser] ?
                  `State: ${this.props.customerInfo[this.props.activeUser].state}` :
                  null}
              />
              <ListItem
                disabled={true}
                primaryText= {this.props.customerInfo[this.props.activeUser] ?
                  `City: ${this.props.customerInfo[this.props.activeUser].city}` :
                  null}
              />
              <ListItem
                disabled={true}
                primaryText= {this.props.customerInfo[this.props.activeUser] ?
                  `Caller type: ${this.props.customerInfo[this.props.activeUser].callerType}` :
                  null}
              />              
              <Divider />
              <ListItem 
                primaryText= {this.state.calling ?  'Hang up' : 'Call this customer'}
                leftIcon={this.state.calling ? <RingVolume /> : <Phone />}
                onClick={() => {
                  this.setState({ calling: !this.state.calling });
                  if (!this.state.calling) {
                    callUser(device, this.props.activeUser);
                  }
                  else {
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
                <br />
                <RaisedButton
                  label="Update Notes"
                  className="note-submit"
                  style={buttonStyle}
                  onClick={this.onFormSubmit}
                  primary
                />
                <br />
              </form>
            </div>
            <Dialog
              title={`${this.state.incomingCaller} is calling`}
              actions={actions}
              modal={true}
              open={this.state.open}
              onRequestClose={this.handleClose}
            />
          </div>
        </Paper>
      </MuiThemeProvider> 
    );
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
  },

};

function mapStateToProps(state) {
  //console.log(state);
  return {
    activeUser: state.center.activeUser,
    customerInfo: state.center.customerInfo,
    notes: state.center.notes,
  };
}
export default connect(mapStateToProps)(RightPageInfo);
