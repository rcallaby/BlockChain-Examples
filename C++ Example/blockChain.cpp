#include <iostream>
#include <vector>
#include <string>
#include <cstdlib>
#include <sstream>
#include <algorithm>
#include <numeric>
#include <cryptopp/sha.h>
#include <cryptopp/hex.h>

using namespace std;
using namespace CryptoPP;

class Block {
public:
    string previousHash;
    vector<string> transactions;
    string blockHash;

    Block(string prevHash) {
        previousHash = prevHash;
        blockHash = calculateHash();
    }

    void addTransaction(string transaction) {
        transactions.push_back(transaction);
        blockHash = calculateHash();
    }

    string calculateHash() {
        stringstream ss;
        ss << previousHash << transactions.size() << accumulate(transactions.begin(), transactions.end(), 0);
        string input = ss.str();
        string output;
        SHA256().CalculateDigest((byte*)&output[0], (byte*)input.c_str(), input.length());
        return output;
    }
};

class Blockchain {
private:
    vector<Block> chain;
    int difficulty;

public:
    Blockchain() {
        difficulty = 4;
        chain.push_back(Block("0"));
    }

    void addBlock(string transaction) {
        Block newBlock(getLatestBlock().blockHash);
        newBlock.addTransaction(transaction);
        chain.push_back(newBlock);
    }

    Block getLatestBlock() {
        return chain.back();
    }

    bool isChainValid() {
        for (int i = 1; i < chain.size(); i++) {
            Block currentBlock = chain[i];
            Block previousBlock = chain[i - 1];
            if (currentBlock.blockHash != currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash != previousBlock.blockHash) {
                return false;
            }
        }
        return true;
    }

    string mineBlock(string transaction) {
        addBlock(transaction);
        return getLatestBlock().blockHash;
    }
};

int main() {
    Blockchain myChain;
    cout << "Mining block 1..." << endl;
    myChain.mineBlock("Transaction 1");
    cout << "Mining block 2..." << endl;
    myChain.mineBlock("Transaction 2");
    cout << "Is blockchain valid? " << myChain.isChainValid() << endl;
}
