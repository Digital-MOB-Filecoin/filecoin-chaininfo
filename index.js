const { Lotus } = require('./lotus');

class FilecoinChainInfo {
    constructor(api, token) {
        this.lotus = new Lotus(api, token);
    }

    Range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }

    async GetMessages(startBlock, onMessagesCallback, onErrorCallback) {
        const chainHead = await this.lotus.ChainHead();
        const blocks = this.Range(startBlock, chainHead.result.Height);

        var blocksSlice = blocks;
        while (blocksSlice.length) {
            await Promise.all(blocksSlice.splice(0, 10).map(async (block) => {
                try {
                    var tipSet = (await this.lotus.ChainGetTipSetByHeight(block, chainHead.result.Cids)).result;
                    const { '/': blockCid } = tipSet.Cids[0];
                    let messages = (await this.lotus.ChainGetParentMessages(blockCid)).result;
                    let receipts = (await this.lotus.ChainGetParentReceipts(blockCid)).result;

                    if (!messages) {
                        messages = [];
                    }
                    messages = messages.map((msg, r) => ({ ...msg.Message, cid: msg.Cid, receipt: receipts[r] }));

                    onMessagesCallback(messages, block);
                } catch (e) {
                    if (onErrorCallback) {
                        onErrorCallback(e.message);
                    }
                }
            }));
        }
    }
}

module.exports = {
    FilecoinChainInfo
};

