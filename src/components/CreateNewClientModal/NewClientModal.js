import React, { useState } from "react";
import ClientFactoryABI from "../../contracts/ClientFactory.json";
import "./NewClientModal.css";

const NewClientModal = ({ onClose, web3, account, clientFactoryAddress }) => {
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    admin: "",
    gender: "",
    accountBalance: "",
  });

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (typeof window.ethereum === "undefined" || !window.ethereum.isMetaMask) {
      console.log("MetaMask is not installed or not connected!");
      return;
    }
    if (!web3 || !account) {
      alert("Web3 instance or account is not available.");
      return;
    }
    try {
      const clientFactory = new web3.eth.Contract(
        ClientFactoryABI.abi,
        clientFactoryAddress
      );

      const transactionParameters = {
        to: clientFactoryAddress,
        from: account, // must match user's active address
        data: clientFactory.methods
          .createNewClient(
            clientData.firstName,
            clientData.lastName,
            clientData.admin,
            clientData.gender,
            clientData.accountBalance
          )
          .encodeABI(),
      }; // call to contract method

      // txHash is a hex string
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      console.log("Transaction Hash:", txHash);
      onClose();
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div className="create-new-client-modal">
      <div className="modal-content">
        <input
          className="modal-input"
          name="firstName"
          placeholder="first name"
          onChange={handleChange}
        />
        <input
          className="modal-input"
          name="lastName"
          placeholder="last name"
          onChange={handleChange}
        />
        <input
          className="modal-input"
          name="admin"
          placeholder="admin"
          onChange={handleChange}
        />
        <input
          className="modal-input"
          name="gender"
          placeholder="gender"
          onChange={handleChange}
        />
        <input
          className="modal-input"
          name="accountBalance"
          placeholder="account balance"
          onChange={handleChange}
        />
        <button className="modal-button" onClick={handleSubmit}>
          Create Client
        </button>
        <button className="modal-button cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewClientModal;
