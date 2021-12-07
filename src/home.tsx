import React from 'react';
import {useState, useMemo} from 'react';
import './app.scss';

import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
// import {Connection, programs, actions, Wallet, NodeWallet, AnyPublicKey} from '@metaplex/js';

import {Keypair, PublicKey, clusterApiUrl} from '@solana/web3.js';

/// Wallet start
import {useWallet} from '@solana/wallet-adapter-react';
import {WalletMultiButton, WalletDisconnectButton} from '@solana/wallet-adapter-react-ui';
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
// import {AuctionExtended} from "@metaplex/js/lib/programs/auction";

// const { metaplex: { Store, AuctionManager }, metadata: { Metadata }, auction: {AuctionExtended}, vault: { Vault } } = programs;
// const {AuctionExtended} = auction;

const connection = new Connection('devnet');
const tokenPublicKey = 'Gz3vYbpsB2agTsAwedtvtTkQ1CG9vsioqLW3r9ecNpvZ';


export const HomeView = () => {
    const wallet = useWallet();
    const { publicKey: walletPubkey } = wallet;

    const [metadataToken, setMetadataToken] = useState(tokenPublicKey);
    const [storeId, setStoreId] = useState('');

    const onTransfer = async () => {
        //Alice private key
        let alicePrivateKey = "78,35,155,11,208,244,57,43,77,145,90,90,202,226,145,63,190,19,247,63,147,37,195,137,46,166,128,153,123,239,156,243,69,206,204,231,116,158,95,159,159,90,238,16,123,241,52,54,187,180,231,132,113,220,136,249,129,98,233,28,62,2,227,202";
        let aliceToken = "C9bYQqtWN76Sc6w5kEvVUyFmpgZdZicy6NVHSiydu5Uk"; //X token acc
        let amount = 100;
        let programIdString = "7K59sz2gbhCe7LLUX5zBnvu1ERbYx3rpvz3Wo6QtRCdQ";

        let bobToken = "FkPoxAXoYWLBapo6cZWBcpUJcpTRADAZyaqTSaWfEGGB";

        let serviceToken = "CBpVBayoRkT7Jzpt3NqEVHf7Co6Q5uCYkDEa9h4o18jq";

        const aliceTokenPubkey = new PublicKey(aliceToken);

        console.log("Step1: ");
        // let accountInfo = (await connection.getAccountInfo(initializerXTokenAccountPubkey, 'singleGossip'));
        // console.log("accountInfo", accountInfo);
        let parsedAccount = (await connection.getParsedAccountInfo(aliceTokenPubkey, 'singleGossip'));
        console.log("parsedXTokenAccount", parsedAccount);
        // return;

        //@ts-expect-error
        const XTokenMintAccountPubkey = new PublicKey(parsedAccount.value!.data.parsed.info.mint);
        let parsedXTokenMintAccount = (await connection.getParsedAccountInfo(XTokenMintAccountPubkey, 'singleGossip'));
        console.log("parsedXTokenMintAccount", parsedXTokenMintAccount);

        const privateKeyDecoded = alicePrivateKey.split(',').map(s => parseInt(s));
        const aliceAccount = new Account(privateKeyDecoded);

        console.log("Alice main account", privateKeyDecoded, "Account", aliceAccount, "public key", aliceAccount.publicKey.toBase58());

        // console.log("Step2: ");
        // const tempTokenAccount = new Account();
        // let paramsForTempToken = {
        //     programId: TOKEN_PROGRAM_ID,
        //     space: AccountLayout.span,
        //     lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'singleGossip'),
        //     fromPubkey: aliceAccount.publicKey,
        //     newAccountPubkey: tempTokenAccount.publicKey
        // }
        // console.log("Step2 - 1 create Instruction to create temp account for X Token");
        // console.log("paramsForTempToken", paramsForTempToken, "temp account", tempTokenAccount.publicKey.toBase58());
        // const createTempTokenAccountIx = SystemProgram.createAccount(paramsForTempToken);
        // console.log("createTempTokenAccountIx", createTempTokenAccountIx);

        // console.log("Step2 - 2 create Instruction to initialize temp account"); //TransactionInstruction
        // const initTempAccountIx = Token.createInitAccountInstruction(TOKEN_PROGRAM_ID, XTokenMintAccountPubkey, tempTokenAccount.publicKey, initializerAccount.publicKey);
        // console.log("initTempAccountIx: TransactionInstruction", initTempAccountIx);
        //
        // console.log("Step2 - 3 create Instruction to transfer the token from X Token to temp token"); //TransactionInstruction
        // const transferXTokensToTempAccIx = Token
        //     .createTransferInstruction(TOKEN_PROGRAM_ID, initializerXTokenAccountPubkey, tempTokenAccount.publicKey, initializerAccount.publicKey, [], amountXTokensToSendToEscrow);
        // console.log("transferXTokensToTempAccIx: TransactionInstruction", initTempAccountIx);


        // console.log("Step3 Send Transaction");
        // const tx1 = new Transaction()
        //     .add(createTempTokenAccountIx, initTempAccountIx, transferXTokensToTempAccIx);
        // await connection.sendTransaction(tx1,
        //     [initializerAccount, tempTokenAccount],
        //     {skipPreflight: false, preflightCommitment: 'singleGossip'});
        //
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        //
        // let parsedTempAccount = (await connection.getParsedAccountInfo(tempTokenAccount.publicKey, 'singleGossip'))!;
        // let parsedInitializerAccount = (await connection.getParsedAccountInfo(initializerXTokenAccountPubkey, 'singleGossip'))!;
        // parsedXTokenMintAccount = (await connection.getParsedAccountInfo(XTokenMintAccountPubkey, 'singleGossip'));
        // console.log("parsedTempAccount: ", parsedTempAccount, "parsedInitializerAccount: ", parsedInitializerAccount, "parsedXTokenMintAccount", parsedXTokenMintAccount);
        //
        // return;
        //
        // console.log("Step2 - 4 create Instruction to create Escrow Account"); //TransactionInstruction
        // const escrowAccount = new Account();
        // const escrowProgramId = new PublicKey(escrowProgramIdString);
        //
        // const createEscrowAccountIx = SystemProgram.createAccount({
        //     space: ESCROW_ACCOUNT_DATA_LAYOUT.span,
        //     lamports: await connection.getMinimumBalanceForRentExemption(ESCROW_ACCOUNT_DATA_LAYOUT.span, 'singleGossip'),
        //     fromPubkey: initializerAccount.publicKey,
        //     newAccountPubkey: escrowAccount.publicKey,
        //     programId: escrowProgramId
        // });
        // console.log("createEscrowAccountIx: TransactionInstruction", createEscrowAccountIx);

        const programId = new PublicKey(programIdString);
        console.log("Step2 - 5 create Instruction to InitEscrow"); //TransactionInstruction
        const initEscrowIx = new TransactionInstruction({
            programId: programId,
            keys: [
                { pubkey: aliceAccount.publicKey, isSigner: true, isWritable: false },
                { pubkey: aliceTokenPubkey, isSigner: false, isWritable: true },
                { pubkey: new PublicKey(bobToken), isSigner: false, isWritable: true },
                { pubkey: new PublicKey(serviceToken), isSigner: false, isWritable: true },
                { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            ],
            data: Buffer.from(Uint8Array.of(0, ...new BN(amount).toArray("le", 8)))
        })

        console.log("Step3 Send Transaction");
        const tx = new Transaction()
            .add(initEscrowIx);
        await connection.sendTransaction(tx,
            [aliceAccount],
            {skipPreflight: false, preflightCommitment: 'singleGossip'});

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // let parsedTempAccount = (await connection.getParsedAccountInfo(tempTokenAccount.publicKey, 'singleGossip'))!;
        // let parsedInitializerAccount = (await connection.getParsedAccountInfo(initializerXTokenAccountPubkey, 'singleGossip'))!;
        // // parsedXTokenMintAccount = (await connection.getParsedAccountInfo(XTokenMintAccountPubkey, 'singleGossip'));
        // let parsedEscrowAccount = (await connection.getParsedAccountInfo(escrowAccount.publicKey, 'singleGossip'));
        // console.log("parsedTempAccount: ", parsedTempAccount);
        // console.log("parsedInitializerAccount: ", parsedInitializerAccount);
        // // console.log("parsedXTokenMintAccount", parsedXTokenMintAccount);
        // console.log("escrowAccount.publicKey", escrowAccount.publicKey.toBase58(), "parsedEscrowAccount", parsedEscrowAccount);
        //
        // const encodedEscrowState = (await connection.getAccountInfo(escrowAccount.publicKey, 'singleGossip'))!.data;
        // const decodedEscrowState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState) as EscrowLayout;
        // console.log("decodedEscrowState", decodedEscrowState);
    }

    return (
        <div className="App">
            <WalletMultiButton /><br/><br/>
            <WalletDisconnectButton />
            <div className={'container-metadata'}>
                <input type={"text"} onChange={(e) => {
                    setMetadataToken(e.target.value)
                }} value={metadataToken}/><br/>
                <button onClick={onTransfer}>Transfer</button>
            </div>
        </div>
    );
};
