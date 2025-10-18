// remove: const { isValidElement } = require("react");
const cryptoHash = require('./crypto-hash');
const Block = require('./block');
class Blockchain {
    constructor(){
        this.chain= [Block.genesis()];  //genesis block
    }
    addBlock({data}){
        const newBlock= Block.mineBlock({   //mining korte hobe add korar age
            lastBlock: this.chain[this.chain.length -1],  //last block
            data,
        });
        this.chain.push(newBlock);  //add new block to chain
    }

    static isValidchain(chain){
    if(JSON.stringify(chain[0])!==JSON.stringify( Block.genesis())) return false; //check   genesis block
    for(let i=1; i< chain.length; i++){
        const {timestamp, lastHash, hash, data, nonce, difficulty}= chain[i];   //current block
        const actualLastHash= chain[i-1].hash;   //previous block er hash

        if(lastHash !== actualLastHash) return false; //check last hash //compare with previous block er hash
        const validatedHash= cryptoHash(timestamp, lastHash, data, nonce, difficulty); //recompute hash
        if(hash !== validatedHash) return false; //check hash
    }
    return true;
    }
}


module.exports = Blockchain;

const blockchain = new Blockchain();
blockchain.addBlock({data: "first block"});
console.log(blockchain);
const result= Blockchain.isValidchain(blockchain.chain);
console.log("is chain valid?", result);
