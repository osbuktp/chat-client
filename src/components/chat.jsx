import React, { Component } from 'react'
import './chat.scss'
import VideoChat from './videochat'
import socket from '../socket'

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: ''
        }
        this.messagesBlock = React.createRef()
    }
    handleChange = e => {
        this.setState({ message: e.target.value })
    }
    handleSubmit = e => {
        e.preventDefault()
        if (this.state.message == '') return
        socket.emit('message', this.props.currentRoomId, this.state.message)
        this.setState({ message: '' })
    }
    componentDidUpdate() {
        this.messagesBlock.current.scrollTop = this.messagesBlock.current.scrollHeight;
    }
    normalizeTime(time) {
        const data = new Date(time)
        return data.toTimeString().slice(0, 9)
    }
    render() {
        return (
            <div className="Chat">
                <div className="videochat-wrapper">
                    <VideoChat room={this.props.currentRoomId} />
                </div>
                <form className="controls" onSubmit={this.handleSubmit}>
                    <input autoFocus={true} placeholder="Write a message..." onChange={this.handleChange} value={this.state.message} type="text" />
                </form>
                <div ref={this.messagesBlock} className="messages">
                    {this.props.currentRoom.messages.map((msg, key) => (
                        <div
                            className={["message", (
                                msg.from == 0 ? 'message__service' : ''
                            ), (
                                    msg.from == this.props.userName ? 'message__self' : ''
                                )].join(' ')} key={key}>
                            <div>
                                {msg.from ? (
                                    msg.from == this.props.userName ? (
                                        <span>{msg.message.text}</span>
                                    ) : (
                                            <div>
                                                <div className="message_from">
                                                    {msg.from}
                                                </div>
                                                <div>
                                                    {msg.message.text}
                                                </div>
                                            </div>
                                        )
                                ) : msg.message.text}
                            </div>
                            <div className="timestamp">
                                <span>
                                    {this.normalizeTime(msg.message.timestamp)}
                                </span>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        )
    }
}

export default Chat