const axios = require('axios');

class Lotus {
    constructor(api, token) {
      this.api = api;
      this.token = token;
    }

    LotusAPI(body) {
        return axios.post(this.api, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
    }
    
    async Version() {
        const response = await this.LotusAPI(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.Version", "params": [], "id": 0 }));
        return response?.data;
    }

    async StateGetActor(miner, tipSetKey) {
        const response = await this.LotusAPI(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.StateGetActor", "params": [miner, tipSetKey], "id": 0 }));
        return response?.data;
    }

    async ChainGetTipSetByHeight(chainEpoch, tipSetKey) {
        const response = await this.LotusAPI(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ChainGetTipSetByHeight", "params": [chainEpoch, tipSetKey], "id": 0 }));
        return response?.data;
    }

    async ChainGetParentMessages(blockCid) {
        const response = await this.LotusAPI(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ChainGetParentMessages", "params": [{ "/": blockCid }], "id": 0 }));
        return response?.data;
    }

    async ChainGetParentReceipts(blockCid) {
        const response = await this.LotusAPI(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ChainGetParentReceipts", "params": [{ "/": blockCid }], "id": 0 }));
        return response?.data;
    }

    async ChainHead() {
        const response = await this.LotusAPI(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ChainHead", "params": [], "id": 0 }));
        return response?.data;
    }
}

module.exports = {
    Lotus
  };