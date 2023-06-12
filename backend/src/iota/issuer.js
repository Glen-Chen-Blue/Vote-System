const identity = require('@iota/identity-wasm/node');

const builder = new identity.AccountBuilder();
const issuer = await builder.createIdentity();

async function initial(){
    // Add verification method to the issuer.
    await issuer.createMethod({
        content: identity.MethodContent.GenerateEd25519(),
        fragment: "#issuerKey"
    })
}

const AddKeyToIssuer = async() => {
    await issuer.createMethod({
        content: identity.MethodContent.GenerateEd25519(),
        fragment: "#issuerKey"
    })
}

export {initial, AddKeyToIssuer}