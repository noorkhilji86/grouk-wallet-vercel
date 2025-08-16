import React, { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { createMnemonic, keypairFromMnemonic } from "./lib/wallet";
import { encryptToStorage, decryptFromStorage } from "./lib/crypto";
import { conn, getBalance, sendSOL, LAMPORTS_PER_SOL } from "./lib/solana";

const STORE_KEY = "grouk:v1:mnemonic";

export default function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pubkey, setPubkey] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const qrRef = useRef(null);

  const hasStored = !!localStorage.getItem(STORE_KEY);

  const explorer = useMemo(() => {
    const onDevnet = (process.env.REACT_APP_RPC_URL || "").includes("devnet");
    return (sig) => `https://explorer.solana.com/tx/${sig}${onDevnet ? "?cluster=devnet" : ""}`;
  }, []);

  useEffect(() => {
    if (unlocked && pubkey) {
      // generate QR
      (async () => {
        try {
          const canvas = qrRef.current;
          if (canvas) await QRCode.toCanvas(canvas, pubkey, { width: 160 });
        } catch {}
      })();
    }
  }, [unlocked, pubkey]);

  async function doCreate() {
    const m = await createMnemonic();
    setMnemonic(m);
    setMessage("Write down these 12 words and keep them safe.");
  }

  async function doSaveAndUnlock() {
    if (!mnemonic || !password) return alert("Mnemonic & password required");
    await encryptToStorage(STORE_KEY, mnemonic, password);
    await doUnlock();
  }

  async function doUnlock() {
    try {
      setLoading(true);
      const m = mnemonic || (await decryptFromStorage(STORE_KEY, password));
      if (!m) { setLoading(false); return alert("Wrong password or wallet not found"); }
      const kp = await keypairFromMnemonic(m);
      setMnemonic(m);
      setPubkey(kp.publicKey.toBase58());
      setUnlocked(true);
      const bal = await getBalance(kp.publicKey);
      setBalance(bal);
      setMessage("");
    } catch (e) {
      alert("Unlock failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshBalance() {
    try {
      const kp = await keypairFromMnemonic(mnemonic);
      const bal = await getBalance(kp.publicKey);
      setBalance(bal);
    } catch (e) {
      alert(e.message);
    }
  }

  async function doSend() {
    try {
      if (!to || !amount) return alert("Address & amount required");
      setLoading(true);
      const kp = await keypairFromMnemonic(mnemonic);
      const sig = await sendSOL(kp, to.trim(), Number(amount));
      setMessage(`✅ Sent! Signature: ${sig}`);
      window.open(explorer(sig), "_blank");
      setTo(""); setAmount("");
      await refreshBalance();
    } catch (e) {
      alert("Send failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function lock() {
    setUnlocked(false);
    setPassword("");
    setMessage("Locked.");
  }

  function wipeLocal() {
    if (!confirm("This will REMOVE your encrypted wallet from this device. Make sure you backed up the seed phrase.")) return;
    localStorage.removeItem(STORE_KEY);
    setMnemonic(""); setPassword(""); setUnlocked(false); setPubkey(""); setBalance(null);
  }

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>GROUK — Solana Wallet (Telegram Mini App)</h2>
      <p className="muted">RPC:
        <code> {process.env.REACT_APP_RPC_URL || "devnet"} </code>
      </p>

      {!unlocked && (
        <>
          {hasStored ? (
            <>
              <h3>Unlock Wallet</h3>
              <div className="row">
                <div>
                  <label>Password</label>
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" />
                </div>
              </div>
              <div className="row">
                <button onClick={doUnlock} disabled={loading}>Unlock</button>
                <button className="danger" onClick={wipeLocal}>Wipe this device</button>
              </div>
              <p className="muted">Forgot password? You must re-import seed phrase.</p>
            </>
          ) : (
            <>
              <div className="grid">
                <div>
                  <h3>Create New Wallet</h3>
                  <p className="muted">Generates a 12-word seed phrase locally.</p>
                  <button onClick={doCreate}>Generate Seed</button>
                  {mnemonic && (
                    <>
                      <textarea rows={3} readOnly value={mnemonic} style={{marginTop:10}} />
                      <div className="row">
                        <div>
                          <label>Set Password (encrypts seed on device)</label>
                          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                        </div>
                      </div>
                      <button onClick={doSaveAndUnlock} disabled={loading}>Save & Unlock</button>
                    </>
                  )}
                </div>

                <div>
                  <h3>Import Existing Wallet</h3>
                  <p className="muted">Paste your 12/24-word mnemonic.</p>
                  <textarea rows={3} value={mnemonic} onChange={e=>setMnemonic(e.target.value)} placeholder="your twelve words ..." />
                  <div className="row">
                    <div>
                      <label>Set Password</label>
                      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                    </div>
                  </div>
                  <button onClick={doSaveAndUnlock} disabled={loading}>Import & Unlock</button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {unlocked && (
        <>
          <div className="grid">
            <div>
              <h3>Your Account</h3>
              <div className="pill">Address</div>
              <p style={{wordBreak:"break-all"}}>{pubkey}</p>
              <div className="pill">Balance</div>
              <p>
                {balance===null ? "…" :
                  (balance / LAMPORTS_PER_SOL).toLocaleString(undefined,{maximumFractionDigits:6})} SOL
              </p>
              <div className="row">
                <button onClick={refreshBalance}>Refresh</button>
                <button onClick={lock}>Lock</button>
              </div>
            </div>

            <div>
              <h3>Receive</h3>
              <canvas ref={qrRef} style={{background:"#fff",borderRadius:8}} />
              <p className="muted">Scan this QR to receive SOL.</p>
              <button onClick={() => navigator.clipboard.writeText(pubkey)}>Copy Address</button>
            </div>
          </div>

          <div style={{marginTop:16}}>
            <h3>Send SOL</h3>
            <div className="row">
              <div>
                <label>To Address</label>
                <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Destination base58 address" />
              </div>
              <div>
                <label>Amount (SOL)</label>
                <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.01" />
              </div>
            </div>
            <button onClick={doSend} disabled={loading}>Send</button>
          </div>

          <div style={{marginTop:16}}>
            <details>
              <summary>⚠️ Backup / Show Seed Phrase</summary>
              <p className="muted">Never share this. Anyone with this seed controls your funds.</p>
              <textarea rows={3} readOnly value={mnemonic} />
            </details>
          </div>
        </>
      )}

      {message && <p className="muted" style={{marginTop:12}}>{message}</p>}
      <p className="muted" style={{marginTop:20}}>
        Non-custodial • Keys never leave your device • Built for Telegram Mini Apps ⚡
      </p>
    </div>
  );
            }
