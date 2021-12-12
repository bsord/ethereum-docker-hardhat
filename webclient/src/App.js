import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import { GREETER_ABI, GREETER_ADDRESS } from './config/greeter'

function App() {
  // define blockchain and smart contract references
  const web3 = new Web3("http://localhost:8545")
  const greeter = new web3.eth.Contract(GREETER_ABI, GREETER_ADDRESS)

  // define state handling objects
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState("");
  const [greeting, setGreeting] = useState("");
  const [newGreeting, setNewGreeting] = useState("");
  
  async function loadBlockchainData() {
    setLoading(true)
    // get account information
    const accounts = await web3.eth.getAccounts()
    setAccount( accounts[0] ) // needs redone to get address from wallet

    // get smart contract from chain
    const greet = await greeter.methods.greet().call()

    // set state with results from contract call
    setGreeting(greet)
    setLoading(false)
  }

  // Load data on first render
  useEffect(() => {
    loadBlockchainData()
  },[]) // eslint-disable-line

  async function changeGreetingOnBlockchain(greeting) {
    setLoading(true)
    greeter.methods.setGreeting(greeting).send({ from: account })
    .once('receipt', (receipt) => {
      loadBlockchainData()
    })
  }

  const handleSubmit = () =>{
    changeGreetingOnBlockchain(newGreeting)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Account: {account} 
        </p>
        <p>
          Greeting: {greeting}
        </p>
        <p>
          <label htmlFor="greeting">Set new greeting:</label>
          <input onChange={(e)=>setNewGreeting(e.target.value)} value={newGreeting} type="text" name="greeting" id="greeting" />
          <button onClick={(e)=>handleSubmit()}>{loading?"loading":"Change greeting"}</button>
        </p>
      </header>
    </div>
  );
}

export default App;
