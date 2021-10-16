const ganache = require("ganache-cli");
const Web3 = require("Web3");
const { abi, bytecode } = require("./../compile");
const assert = require("assert");

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let lottery;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: 1000000 });
  lottery.setProvider = provider;
});

describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one player to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const player = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.strictEqual(player[0], accounts[0]);
    assert.strictEqual(player.length, 1);
  });

  it("allows multiple player to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });
    const player = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.strictEqual(player[0], accounts[0]);
    assert.strictEqual(player[1], accounts[1]);
    assert.strictEqual(player[2], accounts[2]);
    assert.strictEqual(player.length, 3);
  });

  it("only paying member can enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 1,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("gets money", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const diff = finalBalance - initialBalance;
    console.log(diff);
    assert(diff > web3.utils.toWei("1.8", "ether"));
  });
});
