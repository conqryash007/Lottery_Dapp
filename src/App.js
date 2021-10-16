import React,{Component} from "react";
import web3 from "./web3"
import lottery from "./local_contract_copy"
import "./App.css"
class App extends Component{

state = {
  manager:"human",
  players:[],
  balance:"",
  value:"",
  message:""
}

    componentDidMount = async ()=>{
      const manager = await lottery.methods.manager().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      const players = await lottery.methods.getPlayers().call();
      this.setState({manager,balance,players});
    }

    toEnter = async(event)=>{
      this.setState({message:"Please wait until the transaction is processed"});
      event.preventDefault();

      const acc = await web3.eth.getAccounts();

      await lottery.methods.enter().send({from:acc[0],value:web3.utils.toWei(this.state.value,"ether")});
      this.setState({message:"Transaction successful"});
    }

    pickWinner = async ()=>{
      this.setState({message:"Please wait until the transaction is processed"});
      const acc = await web3.eth.getAccounts();
      await lottery.methods.pickWinner().send({from:acc[0]});
      this.setState({message:"Transaction successful"});
    }

    render(){
        return (
          <div>
        <div className = "main">
          <h1>Lottery</h1>
          <p>This lottery is managed by {this.state.manager}</p>
          <p>There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance,"ether")} ethers</p>
          <form onSubmit = {this.toEnter}>
            <h1>Entering the lottery is just 1 click away!</h1>
            <div>
            <h3>Please enter the amount of ether : </h3>
            <input type="text" value = {this.state.value} onChange= {event =>this.setState({value:event.target.value})} />
            <button className="hov">Enter!</button>
            </div>
          </form>
          <h2>PICK A WINNER</h2>
          <button className="hov" type = "button" onClick={this.pickWinner}>Pick Winner</button>
          <p>{this.state.message}</p>
        </div>
        </div>)
    }
}

export default App;
