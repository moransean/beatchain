import React, { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import BeatchainABI from "../abi/Beatchain.json";
import YodaABI from "../abi/YODA.json";
import { generateRandomTraits } from "../utils/traitGenerator";
import * as Tone from "tone";
import { useRef } from "react";


const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Beatchain
const YODA_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // YODA
const MINT_PRICE = parseUnits("10000", 2); // 100.00 YODA (2 decimals)     

let synth;
let loop;

const MintNFT = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [status, setStatus] = useState("");

  const [showTraits, setShowTraits] = useState(false);
  const [traits, setTraits] = useState(null);  

  const melodyLoopRef = useRef(null);
  const bassSynthRef = useRef(null);
  const drumLoopRef = useRef(null);
  const reverbRef = useRef(null);


  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    
      const yoda = new Contract(YODA_ADDRESS, YodaABI.abi, signer);
      const bal = await yoda.balanceOf(address);
      setBalance(formatUnits(bal, 2));
    }
  };

  const handleMintWithTraits = async (traits) => {
    try {
      setStatus("Approving YODA...");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      const yoda = new Contract(YODA_ADDRESS, YodaABI.abi, signer);
      const beatchain = new Contract(CONTRACT_ADDRESS, BeatchainABI.abi, signer);
  
      const approveTx = await yoda.approve(CONTRACT_ADDRESS, MINT_PRICE);
      await approveTx.wait();
  
      setStatus("Minting NFT...");
      const mintTx = await beatchain.mint();
      const receipt = await mintTx.wait();
      console.log("Minted! Transaction hash:", receipt.hash);
  
      const beatchainAddress = CONTRACT_ADDRESS.toLowerCase();

      const transferLog = receipt.logs.find(
        log => log.address.toLowerCase() === beatchainAddress &&
              log.topics[0] === beatchain.interface.getEvent("Transfer").topicHash
      );

      if (!transferLog) throw new Error("Transfer event not found");

      const parsedLog = beatchain.interface.parseLog(transferLog);
      const tokenId = parsedLog.args.tokenId.toString();

  
      // Send traits + tokenId to backend
      const test = await fetch("http://localhost:5000/traits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tokenId, traits })
      });
  
      setStatus(`NFT Minted! Token ID: ${tokenId}, Transaction Hash: ${receipt.hash}`);
      console.log("Traits saved to backend:", test);
      setShowTraits(false);
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    }
  };

  const [audioStarted, setAudioStarted] = useState(false);

  const ensureAudioStarted = async () => {
    if (!audioStarted) {
      await Tone.start();
      setAudioStarted(true);
    }
  };


  useEffect(() => {
    // Melody Synth + Loop
    const synth = new Tone.Synth().toDestination();
    melodyLoopRef.current = new Tone.Loop((time) => {
      synth.triggerAttackRelease("C4", "8n", time);
    }, "4n");
  
    // Bass Synth
    bassSynthRef.current = new Tone.MonoSynth({
      oscillator: { type: "square" },
      filter: { Q: 1, type: "lowpass", rolloff: -12 },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.9, release: 0.5 },
    }).toDestination();
  
    // Drum Loop
    const drum = new Tone.MembraneSynth().toDestination();
    drumLoopRef.current = new Tone.Loop((time) => {
      drum.triggerAttackRelease("C2", "8n", time);
    }, "4n");
  
    // Reverb
    reverbRef.current = new Tone.Reverb({ decay: 3, wet: 0.3 }).toDestination();
    synth.connect(reverbRef.current);
    bassSynthRef.current.connect(reverbRef.current);
  
    // Start all loops
    Tone.Transport.start();
    melodyLoopRef.current.start(0);
    drumLoopRef.current.start(0);
  }, []);
  
  
  const handleTraitChange = (traitName, value) => {
    const parsedValue = parseInt(value);
  
    // Update Tone.js settings dynamically
    if (Tone.Transport.state === "started") {
      switch (traitName) {
        case "tempo":
          Tone.Transport.bpm.rampTo(parsedValue, 0.2);
          break;
  
        case "melodyComplexity":
          // You might change pattern density, or note randomness
          if (melodyLoopRef.current) {
            melodyLoopRef.current.interval = parsedValue > 5 ? "8n" : "4n";
          }
          break;
  
        case "bassDepth":
          // Shift bass pitch lower or apply filter for 'depth'
          if (bassSynthRef.current) {
            const baseFreq = 60 - parsedValue * 2; // range 40Hz–60Hz
            bassSynthRef.current.set({ oscillator: { frequency: baseFreq } });
          }
          break;
  
        case "percussionIntensity":
          // Increase kick/snare volume or add hits
          if (drumLoopRef.current) {
            drumLoopRef.current.probability = parsedValue / 10; // 0.1 - 1.0
          }
          break;
  
        case "reverbAmount":
          if (reverbRef.current) {
            reverbRef.current.wet.value = parsedValue / 100;
          }
          break;
  
        default:
          break;
      }
    }
  };
  
  

  return (
    <div>
      <h2>Mint a Beatchain NFT</h2>
      <p>Connected wallet: {account}</p>
      <p>YODA Balance: {balance}</p>
      <p>Price: 100.00 YODA</p>
      {!showTraits ? (
  <button
    onClick={() => {
      const randomTraits = generateRandomTraits();
      setTraits(randomTraits);
      setShowTraits(true);
      ensureAudioStarted();
    }}
  >
    Mint
  </button>
) : (
  <div>
    <h3>Customize Your NFT</h3>
    <label>
      Tempo: {traits.tempo}
      <input
        type="range"
        min="60"
        max="180"
        value={traits.tempo}
        onChange={(e) => {
          const newVal = parseInt(e.target.value);
          setTraits(prev => ({ ...prev, tempo: newVal }));
          handleTraitChange("tempo", newVal);
        }}
      />
    </label>
    <br />

    <label>
      Melody Complexity: {traits.melodyComplexity}
      <input
        type="range"
        min="1"
        max="10"
        value={traits.melodyComplexity}
        onChange={(e) => {
          const newVal = parseInt(e.target.value);
          setTraits(prev => ({ ...prev, melodyComplexity: newVal }));
          handleTraitChange("melodyComplexity", newVal);
        }}
      />
    </label>
    <br />

    <label>
      Bass Depth: {traits.bassDepth}
      <input
        type="range"
        min="1"
        max="10"
        value={traits.bassDepth}
        onChange={(e) => {
          const newVal = parseInt(e.target.value);
          setTraits(prev => ({ ...prev, bassDepth: newVal }));
          handleTraitChange("bassDepth", newVal);
        }}
      />
    </label>
    <br />

    <label>
      Percussion Intensity: {traits.percussionIntensity}
      <input
        type="range"
        min="1"
        max="10"
        value={traits.percussionIntensity}
        onChange={(e) => {
          const newVal = parseInt(e.target.value);
          setTraits(prev => ({ ...prev, percussionIntensity: newVal }));
          handleTraitChange("percussionIntensity", newVal);
        }}
      />
    </label>
    <br />

    <label>
      Reverb: {traits.reverbAmount}
      <input
        type="range"
        min="0"
        max="100"
        value={traits.reverbAmount}
        onChange={(e) => {
          const newVal = parseInt(e.target.value);
          setTraits(prev => ({ ...prev, reverbAmount: newVal }));
          handleTraitChange("reverbAmount", newVal);
        }}
      />
    </label>
    <br />

    <button onClick={() => handleMintWithTraits(traits)}>Finalize and Mint</button>
  </div>
)}
      <p>{status}</p>
    </div>
  );
};

export default MintNFT;
