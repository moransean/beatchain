import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import YodaTokenAbi from "../abis/YodaToken.json";

const YODA_TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function YodaBalance() {
  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function fetchBalance() { 
      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const yoda = new Contract(YODA_TOKEN_ADDRESS, YodaTokenAbi, provider);
      const rawBalance = await yoda.balanceOf(address);
      const decimals = await yoda.decimals();

      setBalance(formatUnits(rawBalance, decimals));
      console.log(`Balance of ${address}:`, rawBalance.toString());
        console.log(`Formatted balance: ${formatUnits(rawBalance, decimals)}`);
    }

    fetchBalance();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>YODA Token Balance</h2>
      {account && <p><strong>Account:</strong> {account}</p>}
      {balance !== null ? (
        <p><strong>Balance:</strong> {balance} YODA</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
