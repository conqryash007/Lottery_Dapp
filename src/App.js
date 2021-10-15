import React,{Component} from "react";
import web3 from "./web3"
let acc;
const run = async ()=> {
    try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
      acc = await web3.eth.getAccounts();
      console.log(acc);
    } catch (error) {
      console.log(error);
    }
  }
run();

class App extends Component{
    render(){
        return (
        <>
        <h1>{acc}</h1>
        <h1>sdsd</h1></>)
    }
}

export default App;