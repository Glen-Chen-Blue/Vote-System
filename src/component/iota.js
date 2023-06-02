// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

// import { AccountBuilder, ExplorerUrl, Storage } from '@iota/identity-wasm';
const identity = require('@iota/identity-wasm/node')

/**
 * This example shows a basic introduction on how to create a basic DID Document and upload it to the Tangle
 * using the Account.
 */
// async function createIdentity(storage?: Storage) {
async function createIdentity(){

    // The creation step generates a keypair, builds an identity
    // and publishes it to the IOTA mainnet.
    // let builder = new AccountBuilder({
    //     storage,
    // });
    const builder = new identity.AccountBuilder();
    const account = await builder.createIdentity();

    // Retrieve the DID of the newly created identity.
    const did = account.did();

    // Print the DID of the created Identity.
    console.log(did.toString())

    // Print the local state of the DID Document
    console.log(account.document());

    // Print the Explorer URL for the DID.
    console.log(`Explorer Url:`, identity.ExplorerUrl.mainnet().resolverUrl(did));
}

export { createIdentity };