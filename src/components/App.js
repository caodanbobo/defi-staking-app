import React, {Component} from "react";
import './App.css'
import Navbar from "./Nvabar";

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0'
        }
    }

    render() {
        return (
            <div>
                <Navbar account={this.state.account}/>
                <div className="text-center">
                    <h>Hello, World!</h>
                </div>
            </div>
        )
    }
}

export default App;