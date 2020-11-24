# Filecoin ChainInfo

# Install
```
npm i filecoin-chaininfo
```

# Usage

```
const { FilecoinChainInfo } = require('filecoin-chaininfo');
let filecoinChainInfo = new FilecoinChainInfo('lotus.api', 'lotus.token');

await filecoinChainInfo.GetMessages(261000 /*start block*/, async (messages) => {
  for (const msg of messages) {
    if (msg.receipt.ExitCode == 0) {
      // ...
      console.log(msg);
    }
  }
});
```
