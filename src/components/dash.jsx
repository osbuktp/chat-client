import React, {Component} from 'react'
import Rooms from './rooms'
import Chat from './chat'
import './dash.scss'
import socket from '../socket'
import RoomInfo from './RoomInfo'

class Dash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRoomId: props.user.id,
            chatUsers: [],
            translationUsers: []
        }
    }
    changeRoom = roomid => {
        if (roomid == this.state.currentRoomId) return;
        this.setState({currentRoomId:roomid})
        this.getChatInfo()
    }
    componentDidMount() {
        socket
        .on('joined', roomid => {
            this.setState({currentRoomId: roomid})
            this.getChatInfo()
        })
        .on('chat-info', info => {
            console.log('Got chat info')
            console.dir(info)
            this.setState({ chatUsers: info.chatUsers, translationUsers: info.translationUsers })
        })
        .on('user-joinedTranslation', this.getChatInfo)
        .on('user-leftTranslation', this.getChatInfo)
        .on('user-joined', this.getChatInfo)
        .on('user-left', this.getChatInfo)
        this.getChatInfo()
    }
    getChatInfo = () => {
        socket.emit('get-chat-info', this.state.currentRoomId)
    }
    render() {
        return (
            <div className="Dash">
                <Rooms changeRoom={this.changeRoom} rooms={this.props.user.rooms} currentRoomId={this.state.currentRoomId}/>
                <Chat userName={this.props.user.name} sendMessage={this.sendMessage} currentRoomId={this.state.currentRoomId} currentRoom={this.props.user.rooms[this.state.currentRoomId]}/>
                <RoomInfo chatUsers={this.state.chatUsers} translationUsers={this.state.translationUsers}/>
            </div>
        )
    }
}

export default Dash;