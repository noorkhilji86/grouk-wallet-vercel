import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";

const PATH = "m/44'/501'/0'/0'";

export async function createMnemonic() {
  return bip39.generateMnemonic(128); // 12 words
}

export async function keypairFromMnemonic(mnemonic) {
  const seed = await bip39.mnemonicToSeed(mnemonic.trim());
  const { key } = derivePath(PATH, Buffer.from(seed).toString("hex"));
  const secret = nacl.sign.keyPair.fromSeed(key).secretKey;
  return Keypair.fromSecretKey(secret);
}
