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

const muiTheme = getMuiTheme();

const device = new Twilio.Device();

class RightPageInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, open2: false, calling: false, notes: '', incomingCaller: '', connection: false };
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
      }      else {
        const updates = {};
        updates[`/notes/${ this.props.activeUser}`] = newNotesInfo;
        firebase.database().ref().update(updates);
        this.updateState();
      }
    });
  }
  getToken() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/token', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200 && this.props.activeUser) {
          this.setUpConnection(xhr.responseText);
        }
      }
    };
    xhr.send(null);
  }
  setUpConnection(token) {
    device.setup(token);
    device.on('ready', () => console.log('Twilio device is now ready for connections'));
    device.on('error', error => console.log(error.message));
    device.on('connect', () => console.log('successfully established call!'));
    device.on('incoming', (conn) => {
      console.log(`'Incoming connection from  ${conn.parameters.From}`);
      this.handleOpen(conn.parameters.From, conn);
    });
    device.on('cancel', () => {
      if (this.state.open) {
        this.setState({ open: false });
      }
    });
    device.on('disconnect', () => {
      if (this.state.open2) {
        this.setState({ open2: false });
      } else if (this.state.calling) {
        this.setState({ calling: false });
      }
    });
  }

  callUser() {
    const params = {
      To: this.props.activeUser,
    };
    console.log(`Calling  ${params.To}...`);
    device.connect(params);
  }
  updateState() {
    this.setState({ notes: '' });
  }
  handleOpen = (incomingCaller, connection) => {
    this.setState({ open: true, incomingCaller, connection });
  };
  handleOpen2 = () => {
    this.setState({ open2: true });
  }

  handleClose = () => {
    if (this.state.connection) {
      this.state.connection.reject();
    }
    this.setState({ open: false });
  };

  handleClose2 = () => {
    this.setState({ open2: false });
  }

  handleAnswer = () => {
    if (this.state.connection) {
      this.state.connection.accept();
      this.handleOpen2();
    }
    this.setState({ open: false });
  }
  handleEndCall = () => {
    device.disconnectAll();
    this.handleClose2();
  }
  render() {
    const { noteStyle, buttonStyle } = styles;
    const actions = [
      <FlatButton
        label="Decline"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Answer"
        secondary
        onClick={this.handleAnswer}
      />,
    ];
    const actions2 = [
      <FlatButton
        label="End the call"
        secondary
        onClick={this.handleEndCall}
      />,
    ];
    if (!(this.props.activeUser)) {
      return null;
    }
    this.getToken();
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper >
          <div id="paper" style={{ overflowY: 'auto', height: 'calc(100vh - 84px)' }}>
            <List>
              <ListItem
                disabled
                style={{ fontSize: '20px' }}
                primaryText="About this customer"
              />
              <Divider />
              <ListItem
                disabled
                primaryText={this.props.activeUser}
                leftAvatar={<Avatar src={`https://api.adorable.io/avatars/255/${this.props.activeUser}@adorable.png`} />}
              />
              <Divider />
              <ListItem
                disabled
                primaryText={
                  this.props.customerInfo[this.props.activeUser] ?
                  `Name: ${this.props.customerInfo[this.props.activeUser].name}` :
                    null}
              />
              <ListItem
                disabled
                primaryText={
                  this.props.customerInfo[this.props.activeUser] ?
                  `Country: ${this.props.customerInfo[this.props.activeUser].country}` :
                  null}
              />
              <ListItem
                disabled
                primaryText={
                  this.props.customerInfo[this.props.activeUser] ?
                  `State: ${this.props.customerInfo[this.props.activeUser].state}` :
                  null}
              />
              <ListItem
                disabled
                primaryText={this.props.customerInfo[this.props.activeUser] ?
                  `City: ${this.props.customerInfo[this.props.activeUser].city}` :
                  null}
              />
              <ListItem
                disabled
                primaryText={this.props.customerInfo[this.props.activeUser] ?
                  `Caller type: ${this.props.customerInfo[this.props.activeUser].callerType}` :
                  null}
              />
              <Divider />
              <ListItem
                primaryText={this.state.calling ? 'Hang up' : 'Call this customer'}
                leftIcon={this.state.calling ? <RingVolume /> : <Phone />}
                onClick={() => {
                  this.setState({ calling: !this.state.calling });
                  if (!this.state.calling) {
                    this.callUser();
                  } else {
                    device.disconnectAll();
                  }
                }}
              />
              <Divider />
              <ListItem
                disabled
                primaryText="Quick notes:"
              />
              <ListItem
                disabled
                primaryText={this.props.notes ?
                  this.props.notes[this.props.activeUser].notes : null}
              />
            </List>
            <div id="notes-container">
              <form >
                <textarea
                  rows="4"
                  display="block"
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
              modal
              open={this.state.open}
              onRequestClose={this.handleClose}
            />
            <Dialog
              title={`Talking to: ${this.state.incomingCaller}`}
              actions={actions2}
              modal
              open={this.state.open2}
              onRequestClose={this.handleClose2}
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
  return {
    activeUser: state.center.activeUser,
    customerInfo: state.center.customerInfo,
    notes: state.center.notes,
  };
}
export default connect(mapStateToProps)(RightPageInfo);
