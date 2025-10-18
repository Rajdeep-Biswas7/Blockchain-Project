// Define GENESIS_DATA here (was incorrectly requiring './config' which caused a circular import)
const GENESIS_DATA = {
    timestamp: "01/01/2020",
    lastHash: '----',
    hash: 'genesis-hash',
    data: [],
    nonce: 0,
    difficulty: 3,
};

const cryptoHash = require("./crypto-hash");   //importing cryptoHash function
class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {    //block properties
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    static genesis(){
        return new this(GENESIS_DATA);
    }
    static mineBlock({lastBlock, data}){    //mining
        const timestamp= Date.now();        //current time in milliseconds
        const lastHash= lastBlock.hash;      //previous block er hash
        const hash= cryptoHash(timestamp, lastHash, data);  //new hash
        const {difficulty}= lastBlock;   //difficulty same as last block
        return new this({                 //new block
            timestamp,
            lastHash,
            data,
            hash,
            difficulty,
            nonce:0,
        });
    }

}
    const block1= new Block({   //block creation
        timestamp: "01/01/2020",
        lastHash: '----',
        hash: 'hash-one',
        data: [],
        nonce: 0,
        difficulty: 3,
    });
    const genesisBlock = Block.genesis(); //genesis block
    console.log(genesisBlock);

    const result= Block.mineBlock({   //mining
        lastBlock: block1,
        data: 'mined data',
    });
    console.log(result);  // timestamp = sec e asbe

    module.exports = Block;