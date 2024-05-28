import React, {Component} from "react";
import Navbar from "./Nvabar";
import Web3 from "web3";
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import Main from './Main.js'
import ParticleSettings from './ParticleSettings.js'


class App extends Component {

    //componentDidMount once the component 
    //has been inserted to the dom tree
    async componentDidMount() {
        await this.loadWeb3()
        await this.loadBlockChainData()
    }

    async loadWeb3() {
        if(window.ethereum) { //latest
            window.web3=new Web3(window.ethereum)
            //enable is equired so the metamask would ask user for permission
            // this is in EIP 1102
            //await window.ethereum.enable()

            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else if (window.web3){//lagacy
            window.web3 = new Web3(window.web3.currentProvider);
        }else{
            window.alert("no ethereum detected");
        }
    }
    async loadBlockChainData() {
        const web3=window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        const networkId=await web3.eth.net.getId()

        //load Tetherf contract
        //for the networks, it is defined in the Tether.JSON
        //, which is updated by truffle when the contract is deployed
        const tetherData = Tether.networks[networkId]
        if(tetherData){
            const tether =new web3.eth.Contract(Tether.abi, tetherData.address);
            this.setState({tether})
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            this.setState({tetherBalance : tetherBalance.toString()})
        }else{
            window.alert("error, Tether contract not deployed-no network")
        }

        //load Tetherf contract
        const rwdData = RWD.networks[networkId]
        if(rwdData){
            const rwd =new web3.eth.Contract(RWD.abi, rwdData.address);
            this.setState({rwd})
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({rwdBalance : rwdBalance.toString()})
        }else{
            window.alert("error, RWD contract not deployed-no network")
        }

        //load Tetherf contract
        const banlData = DecentralBank.networks[networkId]
        if(banlData){
            const decentralBank =new web3.eth.Contract(DecentralBank.abi, banlData.address);
            this.setState({decentralBank})
            let stakingBalance = await decentralBank.methods.stakingBalances(this.state.account).call()
            console.log(stakingBalance);
            this.setState({stakingBalance : stakingBalance.toString()})
        }else{
            window.alert("error, DecentralBank contract not deployed-no network")
        }
        this.setState({loading:false})
    }

    //staking function
    stakeTokens = (amount) =>{
        this.setState({loading : true})
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account})
        .on('transactionHash', (hash)=>{        
            this.state.decentralBank.methods.depositeTokens(amount).send({from: this.state.account})
            .on('transactionHash', (hash)=>{
                this.setState({loading : false})
            })
        })
    }
    unstakeTokens = (amount) =>{
        this.setState({loading : true})      
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account})
        .on('transactionHash', (hash)=>{
            this.setState({loading : false})
        })
        
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0', 
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }

    render() {
        let content
        {this.state.loading ? content = <p id="loader" className="text-center" style={{margin:'30px'}}>
            LOADING</p> : 
            content =<Main
                tetherBalance={this.state.tetherBalance}
                rwdBalance={this.state.rwdBalance}
                stakingBalance={this.state.stakingBalance}
                stakeTokens={this.stakeTokens} 
                unstakeTokens={this.unstakeTokens} 
                decentralBank={this.state.decentralBank}
            />}
        return (
            <div className="App" style={{position:'relative'}}>
                {/* <div style={{position:'absolute'}}>
                    <ParticleSettings/>
                </div> */}
                
                <Navbar account={this.state.account}/>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role='main' className="col-lg-12 ml-auto mr-auto" style={{maxWidth:'600px', minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;