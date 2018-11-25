import React, { Component } from 'react'
import './controls.scss'

class Controls extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
    }
    handleChange = e => {
        this.setState({value: e.target.value})
    }
    handleSubmit = e => {
        e.preventDefault()
        this.props.handleSubmit(this.state.value)
        this.setState({value: ''})
    }
    render() {
        return (
            <div className="Controls">
                <form onSubmit={this.handleSubmit}>
                    <input autoFocus={this.props.autofocus} placeholder={this.props.placeholder} onChange={this.handleChange} value={this.state.value} type="text"/>
                    <a onClick={this.handleSubmit} className="button">{this.props.buttonText}</a>
                </form>
            </div>
        )
    }
}

export default Controls