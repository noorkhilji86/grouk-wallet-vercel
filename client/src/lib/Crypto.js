const te = new TextEncoder();
const td = new TextDecoder();

async function deriveKey(password, salt) {
  const base = await crypto.subtle.importKey("raw", te.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 200000, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
  );
}

export async function encryptToStorage(key, plaintext, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const k = await deriveKey(password, salt);
  const enc = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k, te.encode(plaintext));
  const blob = btoa(JSON.stringify({ s: Array.from(salt), i: Array.from(iv), d: Array.from(new Uint8Array(enc)) }));
  localStorage.setItem(key, blob);
}

export async function decryptFromStorage(key, password) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const { s, i, d } = JSON.parse(atob(raw));
  const salt = new Uint8Array(s), iv = new Uint8Array(i), data = new Uint8Array(d);
  const k = await deriveKey(password, salt);
  const dec = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, k, data);
  return td.decode(dec);
}
