const { Lotus } = require('./lotus');

class FilecoinChainInfo {
    constructor(api, token) {
        this.lotus = new Lotus(api, token);
    }

    Range(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }

    async GetMessages(startBlock, endBlock, onMessagesCallback, onErrorCallback) {
        const chainHead = await this.lotus.ChainHead();

        if (endBlock > chainHead.result.Height) {
            if (onErrorCallback) {
                onErrorCallback(`endBlock[${endBlock}, is bigger then chainHead[${chainHead.result.Height}]]`);
            }
            endBlock = chainHead.result.Height;
        }

        const blocks = this.Range(startBlock, endBlock);
        let messages = [];

        var blocksSlice = blocks;
        while (blocksSlice.length) {
            await Promise.all(blocksSlice.splice(0, 10).map(async (block) => {
                try {
                    var tipSet = (await this.lotus.ChainGetTipSetByHeight(block, chainHead.result.Cids)).result;
                    const { '/': blockCid } = tipSet.Cids[0];
                    let new_messages = (await this.lotus.ChainGetParentMessages(blockCid)).result;
                    let receipts = (await this.lotus.ChainGetParentReceipts(blockCid)).result;

                    if (!new_messages) {
                        new_messages = [];
                    }
                    new_messages = new_messages.map((msg, r) => ({ ...msg.Message, cid: msg.Cid, receipt: receipts[r], block: block}));
                    messages = [...messages, ...new_messages];

                } catch (e) {
                    if (onErrorCallback) {
                        onErrorCallback(e.message);
                    }
                }
            }));
        }

        onMessagesCallback(messages);
    }
}

module.exports = {
    FilecoinChainInfo
};

