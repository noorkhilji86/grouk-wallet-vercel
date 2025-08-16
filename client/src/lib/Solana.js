import {
  Connection, clusterApiUrl, PublicKey,
  SystemProgram, Transaction, LAMPORTS_PER_SOL
} from "@solana/web3.js";

const url = process.env.REACT_APP_RPC_URL || clusterApiUrl("devnet");
export const conn = new Connection(url, "confirmed");

export async function getBalance(pubkey) {
  return conn.getBalance(pubkey);  // lamports
}

export async function sendSOL(fromKeypair, toBase58, solAmount) {
  const to = new PublicKey(toBase58);
  const lamports = Math.round(Number(solAmount) * LAMPORTS_PER_SOL);

  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash("finalized");
  const tx = new Transaction({ recentBlockhash: blockhash, feePayer: fromKeypair.publicKey })
    .add(SystemProgram.transfer({ fromPubkey: fromKeypair.publicKey, toPubkey: to, lamports }));

  tx.sign(fromKeypair);

  const sig = await conn.sendRawTransaction(tx.serialize());
  await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
  return sig;
}

export { LAMPORTS_PER_SOL };
