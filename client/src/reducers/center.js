//users will be an empty array 
const initState = {
  activeUser: '',
  /*messages: [
    {
      username: 'Harry Potter',
      message: [{
        id: 0,
        text: 'Hey, I think we should follow Malfoy down the halls. He is not up to any good',
      }, {
        id: 0,
        text: 'I also saw him in the room of requirements',
      }],
      image: 'https://api.adorable.io/avatars/255/+14088169237@adorable.png',
    },

    {
      username: 'Hermione Granger',
      message: [{
        id: 0,
        text: 'Hi Caroline! Are you available to study for the transfiguration test in the library at 6?',
      }, {
        id: 0,
        text: 'This test is going to be so hard!',
      }],
      image: 'https://api.adorable.io/avatars/255/+17026755189@adorable.png',
    },

    {
      username: 'Ronald Weasley',
      message: [{
        id: 0,
        text: 'Want to make a quick trip to Hogsmeade?',
      }, {
        id: 0,
        text: 'Have you seen Scabbers?',
      }],
      image: 'https://api.adorable.io/avatars/255/+18475325683@adorable.png',
    },
  ], */
  messages: {
    '+14088169237': {
      '-LJPaMut8jIXLCt_d-kM': {
        '+14088169237': 'Hello!'
      }
    },
    '+17026755189': {
      '-LJQEkzM9d11cxAkl76s': {
        '+17026755189': 'Hey Caroline'
      }
    },
    '+18475325683': {
      '-LJP_vRWk9UTSNoNdeEw': {
        '+18475325683:': 'Hi'
      },
      '-LJPa48OM1NRmnU2Z7QQ': {
        '+15153258366': 'what do you need help with?'
      },
    }
  },
  message: '',
};

// when updating the users array, loop through all users
// when we found the user that's the active user,
// push into the array of messages, the message from the action
// and give it an id of 1
// (chat is each element inside the users array)
const setUsers = ({ users, activeUser }, message) => users.map((chat) => {
  if (activeUser.username === chat.username) {
    const newMessage = chat.message;
    newMessage.push({
      id: 1,
      text: message,
    });
    return { ...chat, message: newMessage };
  }
  return chat;
});

// ...state takes the information within the state
// anything after the comma is just a modification
export default function (state = initState, action) {
  switch (action.type) {
    case 'USER_SELECTED':
      return { ...state, activeUser: action.payload };
    case 'SEND_MESSAGES':
      // when the message is sent, only update the users array
      return { ...state, users: setUsers(state, action.payload) };
  }
  return state;
}

