/*import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
/*class Modal extends React.Component {
  state = {
    open: false,
  };
  // need to make an action creator that handles calling handleOpen from another function
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  if (this.props.showModal === 'true') {
    this.handleOpen();
  }
  render() {
    const actions = [
      <FlatButton
        label="Decline"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Answer"
        secondary={true}
        onClick={this.handleClose}
      />,
    ];

    return (
      <div>
        
        <Dialog
          title="+1xxxxxxxxx is calling"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    showModal: state.center.showModal,
  };
}

export default connect(mapStateToProps)(Modal); */