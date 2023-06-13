const identity = require('@iota/identity-wasm/node');
let issuer;

async function createIssuer() {
    const builder = new identity.AccountBuilder();
    issuer = await builder.createIdentity();
    await issuer.createMethod({
      content: identity.MethodContent.GenerateEd25519(),
      fragment: "#issuerKey"
  })
}

function getIssuer() {
  return issuer;
}

export{
  createIssuer,
  getIssuer,
};
