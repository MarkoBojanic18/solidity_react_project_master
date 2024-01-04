import React, { useState, useEffect } from "react";
import ClientList from "../ClientList/ClientList.js";
import CreateNewClientModal from "../CreateNewClientModal/NewClientModal.js";
import Web3 from "web3";
import "./Main.css";
const clientFactoryAddress = "0x7b65aA8CA232FE8dC6924bD8166C5786c01968c3";
const sepoliaRPCUrl =
  "https://sepolia.infura.io/v3/67bc1009f5a547cc978659e13579ddf0";

const Main = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log("Connected to Ethereum account: ", accounts[0]);
        window.ethereum.on("accountsChanged", (newAccounts) => {
          setAccount(newAccounts[0]);
          console.log("Switched to account: ", newAccounts[0]);
        });
      } else {
        console.log("MetaMask is not installed.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask: ", error);
    }
  };

  useEffect(() => {
    const web3Instance = new Web3(sepoliaRPCUrl);
    console.log(web3Instance);
    setWeb3(web3Instance);
    connectWallet();
    console.log("Web3 instance set up: ", web3);
  }, []);

  return (
    <div className="main-container">
      {!account && (
        <button className="connect-wallet-button" onClick={connectWallet}>
          Connect with metamask
        </button>
      )}

      <ClientList
        className="client-list"
        web3={web3}
        account={account}
        clientFactoryAddress={clientFactoryAddress}
      />
      <button
        className="create-new-client-button"
        onClick={() => setShowCreateModal(true)}
      >
        Create New Client
      </button>
      {showCreateModal && (
        <CreateNewClientModal
          className="create-new-client-modal"
          web3={web3}
          account={account}
          onClose={() => setShowCreateModal(false)}
          clientFactoryAddress={clientFactoryAddress}
        />
      )}
    </div>
  );
};

export default Main;
