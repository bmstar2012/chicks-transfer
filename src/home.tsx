import React from 'react';
import {useState, useMemo} from 'react';
import './app.scss';

import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    Account,
    Connection,
    ParsedAccountData,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction
} from "@solana/web3.js";
import BN from "bn.js";
// import {Connection, programs, actions, Wallet, NodeWallet, AnyPublicKey} from '@metaplex/js';

import {Keypair, PublicKey, clusterApiUrl} from '@solana/web3.js';
/// Wallet start

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {WalletMultiButton, WalletDisconnectButton} from '@solana/wallet-adapter-react-ui';
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
// import {AuctionExtended} from "@metaplex/js/lib/programs/auction";

// const { metaplex: { Store, AuctionManager }, metadata: { Metadata }, auction: {AuctionExtended}, vault: { Vault } } = programs;
// const {AuctionExtended} = auction;

const connection = new Connection("http://localhost:8899", 'singleGossip');
const tokenPublicKey = 'Gz3vYbpsB2agTsAwedtvtTkQ1CG9vsioqLW3r9ecNpvZ';


export const HomeView = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const { publicKey: walletPubkey , sendTransaction } = wallet;

    const [isTransfer, setIsTransfer] = useState(false);

    const [aliceToken, setAliceToken] = useState('8oRKRpcb7GSDugxb6TAuCQjppB2vs6wUiVcwNZwMuyfh');
    const [bobToken, setBobToken] = useState('EMxE8Ts98qVtHm9DjQCtEevm5c9czDToc4QMkGiVdsEM');
    const [serviceToken, setServiceToken] = useState('RQQZJFERGzi5ncpokUjVzAE2z3XK67qdYFPy9E4AgvE');
    const [amount, setAmount] = useState(100);
    const [programId, setProgramId] = useState("7K59sz2gbhCe7LLUX5zBnvu1ERbYx3rpvz3Wo6QtRCdQ");

    const [aliceTokenAmount1, setAliceTokenAmount1] = useState();
    const [bobTokenAmount1, setBobTokenAmount1] = useState();
    const [serviceTokenAmount1, setServiceTokenAmount1] = useState();
    const [aliceTokenAmount2, setAliceTokenAmount2] = useState();
    const [bobTokenAmount2, setBobTokenAmount2] = useState();
    const [serviceTokenAmount2, setServiceTokenAmount2] = useState();


    const onTransfer = async () => {
        //Alice private key
        // let alicePrivateKey = "78,35,155,11,208,244,57,43,77,145,90,90,202,226,145,63,190,19,247,63,147,37,195,137,46,166,128,153,123,239,156,243,69,206,204,231,116,158,95,159,159,90,238,16,123,241,52,54,187,180,231,132,113,220,136,249,129,98,233,28,62,2,227,202";
        // let aliceToken = "C9bYQqtWN76Sc6w5kEvVUyFmpgZdZicy6NVHSiydu5Uk"; //X token acc
        // let amount = 121;
        // let programIdString = "7K59sz2gbhCe7LLUX5zBnvu1ERbYx3rpvz3Wo6QtRCdQ";

        // let bobToken = "FkPoxAXoYWLBapo6cZWBcpUJcpTRADAZyaqTSaWfEGGB";

        // let serviceToken = "CBpVBayoRkT7Jzpt3NqEVHf7Co6Q5uCYkDEa9h4o18jq";
        console.log('connection', connection);
        if (!connection) {
            return;
        }

        const aliceTokenPubkey = new PublicKey(aliceToken);


        console.log("Step1: ");
        let parsedAccount = (await connection.getParsedAccountInfo(aliceTokenPubkey, 'singleGossip'));
        console.log("parsedXTokenAccount", parsedAccount);
        // return;

        //@ts-expect-error
        const XTokenMintAccountPubkey = new PublicKey(parsedAccount.value!.data.parsed.info.mint);
        let parsedXTokenMintAccount = (await connection.getParsedAccountInfo(XTokenMintAccountPubkey, 'singleGossip'));
        console.log("parsedXTokenMintAccount", parsedXTokenMintAccount);

        // const privateKeyDecoded = alicePrivateKey.split(',').map(s => parseInt(s));
        // const aliceAccount = new Account(privateKeyDecoded);

        // console.log("Alice main account", privateKeyDecoded, "Account", aliceAccount, "public key", aliceAccount.publicKey.toBase58());
        if (!walletPubkey) {
            return;
        }

        try {

            let aliceTokenInfo1 = (await connection.getParsedAccountInfo(aliceTokenPubkey, 'singleGossip'));
            let bobTokenInfo1 = (await connection.getParsedAccountInfo(new PublicKey(bobToken), 'singleGossip'))!;
            let serviceTokenInfo1 = (await connection.getParsedAccountInfo(new PublicKey(serviceToken), 'singleGossip'))!;

            const aliceAmount1 = (aliceTokenInfo1.value!.data as ParsedAccountData).parsed.info.tokenAmount.amount;
            setAliceTokenAmount1(aliceAmount1)
            const bobAmount1 = (bobTokenInfo1.value!.data as ParsedAccountData).parsed.info.tokenAmount.amount;
            setBobTokenAmount1(bobAmount1)
            const serviceAmount1 = (serviceTokenInfo1.value!.data as ParsedAccountData).parsed.info.tokenAmount.amount;
            setServiceTokenAmount1(serviceAmount1)



            const initEscrowIx = new TransactionInstruction({
                programId: new PublicKey(programId),
                keys: [
                    {pubkey: walletPubkey, isSigner: true, isWritable: false},
                    {pubkey: aliceTokenPubkey, isSigner: false, isWritable: true},
                    {pubkey: new PublicKey(bobToken), isSigner: false, isWritable: true},
                    {pubkey: new PublicKey(serviceToken), isSigner: false, isWritable: true},
                    {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
                ],
                data: Buffer.from(Uint8Array.of(0, ...new BN(amount).toArray("le", 8)))
            })

            console.log("Step3 Send Transaction");
            const tx = new Transaction()
                .add(initEscrowIx);
            await sendTransaction(tx,
                connection,
                {skipPreflight: false, preflightCommitment: 'singleGossip'});
        } catch (e) {
            console.log("error", e);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        let aliceTokenInfo2 = (await connection.getParsedAccountInfo(aliceTokenPubkey, 'singleGossip'));
        let bobTokenInfo2 = (await connection.getParsedAccountInfo(new PublicKey(bobToken), 'singleGossip'))!;
        let serviceTokenInfo2 = (await connection.getParsedAccountInfo(new PublicKey(serviceToken), 'singleGossip'))!;

        const aliceAmount2 = (aliceTokenInfo2.value!.data as ParsedAccountData).parsed.info.tokenAmount.amount;
        setAliceTokenAmount2(aliceAmount2)
        const bobAmount2 = (bobTokenInfo2.value!.data as ParsedAccountData).parsed.info.tokenAmount.amount;
        setBobTokenAmount2(bobAmount2)
        const serviceAmount2 = (serviceTokenInfo2.value!.data as ParsedAccountData).parsed.info.tokenAmount.amount;
        setServiceTokenAmount2(serviceAmount2)
        setIsTransfer(true);

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
        <div >
        <div className="container">
            <WalletMultiButton /><br/><br/>
            <div>{wallet.publicKey?.toBase58()}</div>
            <br/>
            <div className={'container-metadata'}>
                <h3>Program</h3>
                <input type={"text"} onChange={(e) => {
                    setProgramId(e.target.value)
                }} value={programId}/><br/>
                <h3>Alice Token address</h3>
                <input type={"text"} onChange={(e) => {
                    setAliceToken(e.target.value)
                }} value={aliceToken}/><br/>
                <h3>Bob Token address</h3>
                <input type={"text"} onChange={(e) => {
                    setBobToken(e.target.value)
                }} value={bobToken}/><br/>
                <h3>Service Token address</h3>
                <input type={"text"} onChange={(e) => {
                    setServiceToken(e.target.value)
                }} value={serviceToken}/><br/>
                <br/>
                <h3>Amount</h3>
                <input type={"number"} onChange={(e) => {
                    setAmount(parseInt(e.target.value))
                }} value={amount}/><br/>
                <br/>
                <button onClick={onTransfer}>Transfer</button>
                <br/>
                <br/>
                {isTransfer && <div>
                <h3>Result</h3>
                    Alice: {aliceTokenAmount1} {'=>'} {aliceTokenAmount2}<br/>
                    Bob: {bobTokenAmount1} {'=>'} {bobTokenAmount2}<br/>
                    Service: {serviceTokenAmount1} {'=>'} {serviceTokenAmount2}<br/>
                    Fee: 5%
                </div>}
            </div>
        </div>
        </div>
    );
};
