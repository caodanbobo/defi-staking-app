import React, { Component } from "react";
import DecentralBank from '../truffle_abis/DecentralBank.json'

class Airdrop extends Component {

    constructor(){
        super()
        this.state={time:{}, seconds: 10}
        this.timer=0
        this.startTimer=this.startTimer.bind(this);
        this.countDown=this.countDown.bind(this);
    }

    startTimer() {
        if(this.timer==0 && this.state.seconds>0){
            this.timer = setInterval(this.countDown, 1000)
        }
    }

    countDown() {
        let seconds=this.state.seconds-1;
        this.setState({
            time : this.secondsToTime(seconds),
            seconds:seconds
        })

        if(seconds==0){
            clearInterval(this.timer);
            this.issueTokens();
        }
    }

    // is the keyword "function" redaudent?
    secondsToTime(secs) {
        let hours, seconds, minutes;
        hours = Math.floor(secs / 3600);

        let devisor_for_minutes= secs % 3600;
        minutes=Math.floor(devisor_for_minutes/60);

        let devisor_for_seconds=devisor_for_minutes % 60;
        seconds=Math.ceil(devisor_for_seconds);

        let obj={
            'h':hours,
            'm':minutes,
            's':seconds
        }
        return obj;
    }

    componentDidMount(){
        let timeLeftVar=this.secondsToTime(this.state.seconds)
        this.setState({time: timeLeftVar})
    }

    airdropReleaseTokens() {
        let stakingB=this.props.stakingBalance
        if(stakingB >= '5000000000000000000'){
            this.startTimer()
        }
    }
    async issueTokens() {
        let decentralBank=this.props.decentralBank;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const ownerAddress = accounts[0];
        if (!decentralBank || !ownerAddress) {
            throw new Error("Invalid contract instance or owner address");
        }
        console.log(ownerAddress)
        await decentralBank.methods.issueTokens().send({from:ownerAddress})
    }

    render (){
        this.airdropReleaseTokens()
        //why there are "()" not "{}"?
        return (
            <div style={{color:'black'}}> {this.state.time.m}:{this.state.time.s}
            </div>
        )
    }
}
export default Airdrop;