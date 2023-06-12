// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const identity = require('@iota/identity-wasm/node');
const builder = new identity.AccountBuilder();
const issuer = await builder.createIdentity();
// import {GetIssuer} from './issuer'
// const storage = require("Storage")

/**
 This example shows how to create a Verifiable Credential and validate it.
 In this example, alice takes the role of the subject, while we also have an issuer.
 The issuer signs a UniversityDegreeCredential type verifiable credential with Alice's name and DID.
 This Verifiable Credential can be verified by anyone, allowing Alice to take control of it and share it with whomever they please.
 **/
async function createVC(name, age) {
    
    // const issuer = GetIssuer()

    // Create an identity for the issuer.
    
    // Add verification method to the issuer.
    fragment = Math.random().toString(36)+"Key";
    await issuer.createMethod({
        content: identity.MethodContent.GenerateEd25519(),
        fragment: fragment
    })
    // Create an identity for the holder, in this case also the subject.
    const account = await builder.createIdentity();

    // Create a credential subject indicating the degree earned by Alice, linked to their DID.
    const subject = {
        id: account.document().id(),
        name: name,
        age: age,
        issuerKey: fragment
    };

    // Create an unsigned `UniversityDegree` credential for Alice
    const unsignedVc = new identity.Credential({
        id: "https://example.edu/credentials/3732",
        type: "VoteCredential",
        issuer: issuer.document().id(),
        credentialSubject: subject
    });

    // Created a signed credential by the issuer.
    const signedVc = await issuer.createSignedCredential(
        "#issuerKey",
        unsignedVc,
        identity.ProofOptions.default(),
    );

    // Before sending this credential to the holder the issuer wants to validate that some properties
    // of the credential satisfy their expectations.


    // Validate the credential's signature, the credential's semantic structure,
    // check that the issuance date is not in the future and that the expiration date is not in the past.
    identity.CredentialValidator.validate(
        signedVc,
        issuer.document(),
        identity.CredentialValidationOptions.default(),
        identity.FailFast.AllErrors
    );

    // Since `validate` did not throw any errors we know that the credential was successfully validated.
    console.log(`VC successfully validated`);
    // console.log(alice.did());

    // The issuer is now sure that the credential they are about to issue satisfies their expectations.
    // The credential is then serialized to JSON and transmitted to the holder in a secure manner.
    // Note that the credential is NOT published to the IOTA Tangle. It is sent and stored off-chain.
    const credentialJSON = signedVc.toJSON();
    console.log(credentialJSON);    
    return credentialJSON;
}
async function login(VC){

    // const builder = new identity.AccountBuilder();
    // const did = identity.DID.parse(VC.credentialSubject.id);
    const account = await builder.createIdentity();
    await account.createMethod({
        content: identity.MethodContent.GenerateEd25519(),
        fragment: "#accountKey"
    })
    const unsignedVp = new identity.Presentation({
        holder: account.did(),
        verifiableCredential: receivedVc
    })

    const challenge = "475a7984-1bb5-4c4c-a56f-822bccd46440";
    const expires = identity.Timestamp.nowUTC().checkedAdd(Duration.minutes(10));

    const signedVp = await account.createSignedPresentation(
        "#accountKey",
        unsignedVp,
        new ProofOptions({
            challenge: challenge,
            expires
        })
    );

    const signedVpJSON = signedVp.toJSON();

    const presentation = identity.Presentation.fromJSON(signedVpJSON);

    const presentationVerifierOptions = new identity.VerifierOptions({
        challenge: challenge,
        allowExpired: false,
    });

    // Declare that any credential contained in the presentation are not allowed to expire within the next 10 hours:
    const earliestExpiryDate = identity.Timestamp.nowUTC().checkedAdd(identity.Duration.hours(10));
    const credentialValidationOptions = new identity.CredentialValidationOptions({
        earliestExpiryDate: earliestExpiryDate,
    });

    // Declare that the presentation holder's DID must match the subject ID on all credentials in the presentation.
    const subjectHolderRelationship = identity.SubjectHolderRelationship.AlwaysSubject;

    const presentationValidationOptions = new identity.PresentationValidationOptions({
        sharedValidationOptions: credentialValidationOptions,
        presentationVerifierOptions: presentationVerifierOptions,
        subjectHolderRelationship: subjectHolderRelationship,
    });

    // In order to validate presentations and credentials one needs to resolve the DID Documents of
    // the presentation holder and of credential issuers. This is something the `Resolver` can help with.
    const resolver = new identity.Resolver();

    // Validate the presentation and all the credentials included in it according to the validation options
    try{
        await resolver.verifyPresentation(
            presentation,
            presentationValidationOptions,
            identity.FailFast.FirstError
        );
        console.log(`VP successfully validated`);
    }
    catch(e){
        console.log("The account have already voted");
    }

    // Since no errors were thrown by `verifyPresentation` we know that the validation was successful.
    // console.log(`VP successfully validated`);

}
// const vote = async(VC) => {

// }
export {createVC, login};