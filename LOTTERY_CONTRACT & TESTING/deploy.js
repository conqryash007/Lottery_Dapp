const Web3 = require("Web3");
const { abi, bytecode } = require("./compile");
const HDWalletProvider = require("@truffle/hdwallet-provider");


let provider = new HDWalletProvider({
  mnemonic: {
    phrase: "receive chunk sugar century school coin lyrics fluid vessel december stone forget"
  },
  providerOrUrl: "https://rinkeby.infura.io/v3/d74a4e3b04cc4061a37770132b6fd0b6"
});

const web3 = new Web3(provider);

web3.setProvider(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: 1000000 });
    
    console.log("add =", result.options.address);
};
deploy();

provider.engine.stop();