StellarHDWallet = require('stellar-hd-wallet');
var StellarSdk = require('stellar-sdk');

var server = new StellarSdk.Server('https://api.testnet.minepi.com');
// Minting Keys
// pair
//var keypair = StellarSdk.Keypair
var mintingKeys = new StellarSdk.Keypair.fromSecret("tourist display ecology vault album fly steak glance jar agree expand wild repeat candy local piano neutral second label foot grant place bring figure");
//"GCLWXVDAY5YCKSQGPC6LGKLQBCR45UL5FBBGESPUSYX4NZKVI47TW2ME", 
// Receiving Keys

var pair = StellarSdk.Keypair.fromPublicKey("GBWPTRZULWV5VDH5SIEOWOZKAPOIEVYUTDBVJRORMU7ZRQAU2EX3WMOM");

// Add NFTree
var nftree = new StellarSdk.Asset("NFTree", mintingKeys.publicKey());

async function createAccount() {

    try {
        const response = await fetch(
            `https://friendbot.stellar.org?addr=${encodeURIComponent(
                pair.publicKey(),
            )}`,
        );
        console.log("SUCCESS! You have a new account :)\n", response);
        document.getElementById("publicKey").value = pair.publicKey();
        document.getElementById("secretKey").value = pair.secret();

    } catch (e) {
        console.error("ERROR!", e);
    }
}
// mint NFT
function mintNFT() {
    console.log("minting NFT");
    // load account
    // minting keys
    server
        .loadAccount(pair.publicKey())
        .then(function (receiver) {
            var transaction = new StellarSdk.TransactionBuilder(receiver, {
                fee: 1,
                networkPassphrase: "Pi Testnet",
            })
                // The `changeTrust` operation creates (or alters) a trustline
                // The `limit` parameter below is optional
                .addOperation(
                    StellarSdk.Operation.changeTrust({
                        asset: nftree,
                        limit: "1000",
                    }),
                )
                // setTimeout is required for a transaction
                .setTimeout(100)
                .build();
            transaction.sign(pair);
            return server.submitTransaction(transaction);
        })
        .then(console.log)
        // Second, the issuing account actually sends a payment using the asset
        .then(function () {
            return server.loadAccount(mintingKeys.publicKey());
        })
        .then(function (issuer) {
            var transaction = new StellarSdk.TransactionBuilder(issuer, {
                fee: 1,
                networkPassphrase: "Pi Testnet",
            })
                .addOperation(
                    StellarSdk.Operation.payment({
                        destination: pair.publicKey(),
                        asset: nftree,
                        amount: "1",
                    }),
                )
                // setTimeout is required for a transaction
                .setTimeout(100)
                .build();
            transaction.sign(mintingKeys);
            return server.submitTransaction(transaction);
        })
        .then(console.log)
        .catch(function (error) {
            console.error("Error!", error);
        });
}