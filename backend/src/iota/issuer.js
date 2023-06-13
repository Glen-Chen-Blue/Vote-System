const identity = require('@iota/identity-wasm/node');
let issuer;

async function createIssuer() {
    const builder = new identity.AccountBuilder();
    issuer = await builder.createIdentity();
}

function getIssuer() {
  return issuer;
}

export{
  createIssuer,
  getIssuer,
};
