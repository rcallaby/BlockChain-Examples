const sha256 = require('js-sha256');

class Block {
  constructor(timestamp, data, previousHash, nonce) {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(
      this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce
    );
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(Date.now(), 'Genesis block', '0', 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);
    console.log('Block successfully mined!');
    this.chain.push(block);
    this.pendingTransactions = [
      {
        from: 'network',
        to: miningRewardAddress,
        amount: this.miningReward,
      },
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.data) {
        if (trans.from === address) {
          balance -= trans.amount;
        }
        if (trans.to === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }
}

let Coin = new Blockchain();
Coin.createTransaction({
  from: 'address1',
  to: 'address2',
  amount: 100,
});
Coin.createTransaction({
  from: 'address2',
  to: 'address1',
  amount: 50,
});

console.log('\nStarting the miner...');
Coin.minePendingTransactions('miner-address');

console.log('\nBalance of miner is', Coin.getBalanceOfAddress('miner-address'));

console.log('\nStarting the miner again...');
Coin.minePendingTransactions('miner-address');

console.log('\nBalance of miner is', Coin.getBalanceOfAddress('miner-address'));
