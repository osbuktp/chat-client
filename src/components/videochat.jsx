import React, { Component } from 'react'
import socket from '../socket';
import './videochat.scss'

const peerConnectionConfig = {
    'iceServers': [
        { url: 'stun:stun.l.google.com:19302' },
        { url: 'stun:stun.services.mozilla.com' },
    ]
}

class VideoChat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            socketId: '',
            localStream: {},
            localStreamSRC: '',
            streams: [],
            connections: []
        }
        this.localVideo = React.createRef()
    }
    gotUserMedia = stream => {
        this.setState({
            localStream: stream,
            localStreamSRC: URL.createObjectURL(stream),
            socketId: socket.id
        })
        socket
            .on('signal', this.gotSignal)
            .on('user-leftTranslation', (id) => {
                if (id == this.state.socketId) {
                    this.setState({
                        connectons: {},
                        streams: {}
                    })
                    return;
                }
                let connections = { ...this.state.connections }
                let streams = { ...this.state.streams }
                delete connections[id]
                delete streams[id]
                this.setState({ connections, streams })
            })
            .on('user-joinedTranslation', (id, count, clients) => {
                console.log(typeof clients, count)
                console.dir(clients)
                clients.forEach(socketListId => {
                    if (!this.state.connections[socketListId]) {
                        let connections = { ...this.state.connections }
                        connections[socketListId] = new RTCPeerConnection(peerConnectionConfig)
                        connections[socketListId].onicecandidate = event => {
                            if (event.candidate != null) {
                                console.log('sending ice')
                                socket.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                            }
                        }
                        connections[socketListId].onaddstream = event => {
                            this.gotRemoteStream(event, socketListId)
                        }
                        connections[socketListId].addStream(this.state.localStream)
                        this.setState({ connections })
                    }
                })
                if (count >= 2) {
                    let connection = this.state.connections[id]
                    connection.createOffer().then(description => {
                        connection.setLocalDescription(description).then(() => {
                            socket.emit('signal', id, JSON.stringify({ 'sdp': connection.localDescription }))
                        })
                    })
                        .catch(err => console.log(err))
                }
            })
    }
    componentDidMount() {
        navigator.getUserMedia({
            video: true,
            audio: true
        },
            this.gotUserMedia,
            err => console.log(err)
        )
    }
    gotSignal = (from, message) => {
        let signal = JSON.parse(message)
        if (from == this.state.socketId) return
        let connection = this.state.connections[from]
        if (signal.sdp) {
            connection.setRemoteDescription(new RTCSessionDescription(signal.sdp))
                .then(() => {
                    if (signal.sdp.type == 'offer') {
                        connection.createAnswer().then(description => {
                            connection.setLocalDescription(description).then(() => {
                                socket.emit('signal', from, JSON.stringify({
                                    'sdp': connection.localDescription
                                }))
                            })
                        })
                    }
                })
                .catch(err => console.log)
        }
        if (signal.ice) {
            connection.addIceCandidate(new RTCIceCandidate(signal.ice))
                .catch(err => console.log)
        }
    }
    gotRemoteStream = (event, id) => {
        let streams = { ...this.state.streams }
        streams[id] = URL.createObjectURL(event.stream)
        this.setState({ streams })
    }
    joinTranslation = () => {
        socket.emit('join-translation', this.props.room)
    }
    leaveTranslation = () => {
        socket.emit('leave-translation', this.props.room)
    }
    render() {
        return (
            <div className="VideoChat">
                <div className="videos">
                    <video style={{ position: 'absolute', right: '0px', bottom: '0px' }} autoPlay={true} src={this.state.localStreamSRC} ref={this.localVideo}></video>
                    {Object.keys(this.state.streams).map(stream => (
                        <video autoPlay={true} key={this.state.streams[stream]} src={this.state.streams[stream]} />
                    ))}
                </div>
                <div className="control-panel">
                    <button onClick={this.joinTranslation}>Join</button>
                    <button onClick={this.leaveTranslation}>Leave</button>
                </div>
            </div>
        )
    }
}

export default VideoChat