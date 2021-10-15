const fs = require("fs");
const solc = require("solc");
const path = require("path");

const pathLottery = path.join(__dirname, "contract/Lottery.sol");
const lottery = fs.readFileSync(pathLottery, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Lottery.sol": {
      content: lottery,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

let output = JSON.parse(solc.compile(JSON.stringify(input)));
exports.abi = output.contracts["Lottery.sol"]["Lottery"].abi;
exports.bytecode =
  output.contracts["Lottery.sol"]["Lottery"].evm.bytecode.object;
