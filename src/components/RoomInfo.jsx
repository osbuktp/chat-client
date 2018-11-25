import React from 'react'

function RoomInfo(props) {
    return (
        <div className="RoomInfo">
            <div className="chatInfo">
                <h1>Chat users</h1>
                {props.chatUsers.map(user => (
                    <p key={user}>{user}</p>
                ))}
            </div>
            <div className="translationInfo">
                <h1>Translation users</h1>
                {props.translationUsers.map(user => (
                    <p key={user}>{user}</p>
                ))}
            </div>
        </div>
    )
}

export default RoomInfo