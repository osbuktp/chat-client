import React, { Component } from 'react'
import Controls from './controls'
import socket from '../socket.js'
import './rooms.scss'

class Rooms extends Component {
    render() {
        return (
            <div className="Rooms">
                <Controls buttonText="Join" handleSubmit={this.handleSubmit} placeholder="Room id" />
                {Object.keys(this.props.rooms).map(roomid => (
                    <p className={this.props.currentRoomId == roomid ? 'active' : ''} onClick={() => this.props.changeRoom(roomid)} key={roomid}>{roomid}</p>
                ))}
            </div>
        )
    }
    handleSubmit = room => {
        socket.emit('join-room', room)
    }
}

export default Rooms