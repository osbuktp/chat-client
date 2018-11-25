import React, {
  Component
} from 'react';
import './App.css';
import socket from './socket.js';
import Dash from './components/dash'
import Controls from './components/controls'

class App extends Component {
  render() {
    return (
      <div className="App" > {
        this.state.isRegistered ?
          (<Dash user={this.state.user}/>) :
          (<Controls autofocus={true}
            placeholder="Username"
            buttonText="Login"
            handleSubmit={this.register}
          />)
      } </div>)
  }
  constructor(props) {
    super(props)
    this.state = {
      isRegistered: false,
      user: {
        name: '',
        rooms: {},
        id: ''
      }
    }
  }
  register = name => {
    socket.emit('register', name)
  }
  registered = (userid, username) => {
    let user = {...this.state.user}
    user.id = userid
    user.name = username
    user.rooms[userid] = {
      users: [],
      messages: []
    }
    this.joinRoom(userid)
    this.setState({user, isRegistered: true})
  }
  joinRoom = room => {
    socket.emit('join-room', room)
  }
  joined = (room, userid) => {
    console.log(`I joined ${room}`)
    let user = {
      ...this.state.user
    }
    if (!user.rooms[room]) user.rooms[room] = {
      users: [],
      messages: []
    }
    user.rooms[room].users.push(userid)
    console.dir(user)
    this.setState({user})
  }
  message = (room, from, message) => {
    console.dir(message)
    let user = {
      ...this.state.user
    }
    user.rooms[room].messages.push({
      from,
      message
    })
    this.setState({
      user
    })
  }
  componentDidMount() {
    socket
      .on('message', this.message)
      .on('registered', this.registered)
      .on('user-joined', this.joined)
      .on('error', err => console.log(err))
  }
}

export default App;