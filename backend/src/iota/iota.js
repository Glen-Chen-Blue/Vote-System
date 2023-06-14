// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { getIssuer } from './issuer';
const identity = require('@iota/identity-wasm/node');
// import {GetIssuer} from './issuer'
// const storage = require("Storage")
// const builder = new identity.AccountBuilder();
// const issuer = await builder.createIdentity();
/**
 This example shows how to create a Verifiable Credential and validate it.
 In this example, alice takes the role of the subject, while we also have an issuer.
 The issuer signs a UniversityDegreeCredential type verifiable credential with Alice's name and DID.
 This Verifiable Credential can be verified by anyone, allowing Alice to take control of it and share it with whomever they please.
 **/
 function randomString(e) {    
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
    for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}
async function createVC(name, age) {
    const builder = new identity.AccountBuilder();
    const issuer = getIssuer();
    // const fragment = Math.random().toString(36).slice(-12);

    const fragment = randomString(32);
    console.log(fragment)
    const account = await builder.createIdentity();
    await issuer.createMethod({
        content: identity.MethodContent.GenerateEd25519(),
        fragment: fragment
    })
    const subject = {
        id: account.document().id(),
        name: name,
        age: age,
        issuerKey: fragment,
        voted: []
    };
    const unsignedVc = new identity.Credential({
        id: "https://example.edu/credentials/3732",
        type: "VoteCredential",
        issuer: issuer.document().id(),
        credentialSubject: subject
    });
    const signedVc = await issuer.createSignedCredential(
        fragment,
        unsignedVc,
        identity.ProofOptions.default(),
    );
    identity.CredentialValidator.validate(
        signedVc,
        issuer.document(),
        identity.CredentialValidationOptions.default(),
        identity.FailFast.AllErrors
    );
    console.log(`VC successfully validated`);
    const credentialJSON = signedVc.toJSON();
    console.log(credentialJSON);   
    const PrivateKey =  randomString(32);
    console.log(PrivateKey)
    await account.createMethod({
        content: identity.MethodContent.PrivateEd25519(PrivateKey),
        fragment: "#accountKey"
    })
    
    const output = {
        vc:credentialJSON,
        privateKey:PrivateKey
    }
    console.log(output);

    return output;
}
async function login(privateKey, VC){
    try{
        const builder = new identity.AccountBuilder();
        
        // const did = identity.DID.parse(VC.credentialSubject.id);
        // const account = await builder.createIdentity();
        // await account.createMethod({
        //     content: identity.MethodContent.GenerateEd25519(),
        //     fragment: "#accountKey"
        // })
        const re = new identity.Resolver();
        const account = await re.resolve(VC.credentialSubject.id);
        const receivedVc=identity.Credential.fromJSON(VC);
        console.log(receivedVc)
        console.log(account.document().id())
        const unsignedVp = new identity.Presentation({
            holder: account.document().id(),
            verifiableCredential: receivedVc
        })
        

        const challenge = "475a7984-1bb5-4c4c-a56f-822bccd46440";
        const expires = identity.Timestamp.nowUTC().checkedAdd(identity.Duration.minutes(10));

        // const signedVp = await account.createSignedPresentation(
        //     "#accountKey",
        //     unsignedVp,
        //     new identity.ProofOptions({
        //         challenge: challenge,
        //         expires
        //     })
        // );
        // console.log(identity.DIDUrl.parse(VC.credentialSubject.id).query());

        const signedVp = await account.document().signPresentation(
            unsignedVp,
            privateKey,
            "#accountKey",
            new identity.ProofOptions({
                challenge: challenge,
                expires
            })
        )

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
        await resolver.verifyPresentation(
            presentation,
            presentationValidationOptions,
            identity.FailFast.FirstError
        );

        // Since no errors were thrown by `verifyPresentation` we know that the validation was successful.
        console.log(`VP successfully validated`);
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}
async function setNewVc(poll_ID, vc){
    vc.credentialSubject.voted.push(poll_ID);
    console.log(vc.credentialSubject.voted);

    const fragment = randomString(32);
    // console.log(fragment)
    const issuer = getIssuer();
    await issuer.createMethod({
        content: identity.MethodContent.GenerateEd25519(),
        fragment: fragment
    })

    const subject = {
        id: vc.credentialSubject.id,
        name: vc.credentialSubject.name,
        age: vc.credentialSubject.age,
        issuerKey: fragment,
        voted: vc.credentialSubject.voted
    };
    console.log(subject)
    const unsignedVc = new identity.Credential({
        id: "https://example.edu/credentials/3732",
        type: "VoteCredential",
        issuer: issuer.document().id(),
        credentialSubject: subject
    });
    await issuer.deleteMethod({fragment: vc.credentialSubject.issuerKey})
    
    
    const signedVc = await issuer.createSignedCredential(
        fragment,
        unsignedVc,
        identity.ProofOptions.default(),
    );
    identity.CredentialValidator.validate(
        signedVc,
        issuer.document(),
        identity.CredentialValidationOptions.default(),
        identity.FailFast.AllErrors
    );
    console.log(`VC successfully validated`);
    return signedVc
}
export {createVC, login, setNewVc};