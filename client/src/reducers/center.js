
const initState = {
  activeUser: '',
  users: [
    {
      username: 'Harry Potter',
      message: [{
        id: 0,
        text: 'Hey, I think we should follow Malfoy down the halls. He is not up to any good',
      }, {
        id: 0,
        text: 'I also saw him in the room of requirements',
      }],
      image: 'https://vignette.wikia.nocookie.net/harrypotter/images/b/ba/Harry-Potter-1-.jpg/revision/latest?cb=20090725202753',
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
      image: 'https://78.media.tumblr.com/6f3d171e49124b15429a8fb6b556b861/tumblr_p1dzfudWbF1vcmbt9o1_400.png',
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
      image: 'https://typeset-beta.imgix.net/lovelace/uploads/36/908c1ab0-9b56-0132-a2c8-0e6808eb79bf.jpg',
    },
  ],
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

export default function (state = initState, action) {
  switch (action.type) {
    case 'USER_SELECTED':
      return { ...state, activeUser: action.payload };
    case 'SEND_MESSAGE':
      // when the message is sent, only update the users array
      return { ...state, users: setUsers(state, action.payload) };
  }
  return state;
}
