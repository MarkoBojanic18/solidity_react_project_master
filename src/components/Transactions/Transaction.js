import React, { useState, useEffect } from "react";
import ClientFactoryABI from "../../contracts/ClientFactory.json";
import "./Transaction.css";

const Transaction = ({ web3, account, clientFactoryAddress }) => {
  const [accountFound, setAccountFound] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [transferData, setTransferData] = useState({
    amount: 0,
    recipientAddress: "",
  });

  const handleChangeWithdraw = (e) => {
    // Update the inputValue state when the input value changes
    setWithdrawAmount(e.target.value);
  };

  const handleSubmitWithdrawalAmount = async () => {
    if (transferData.amount == 0) {
      alert("Amount should be >= 0");
    } else {
      if (
        typeof window.ethereum === "undefined" ||
        !window.ethereum.isMetaMask
      ) {
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
          data: clientFactory.methods.withdrawMoney(withdrawAmount).encodeABI(),
        }; // call to contract method

        // txHash is a hex string
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        console.log("Transaction Hash:", txHash);

        const currentBalance = await clientFactory.methods
          .showClientBalance()
          .call({ from: account });

        console.log(currentBalance);
      } catch (error) {
        console.error(
          "Error while trying to execute withdrawal function:",
          error
        );
      }
    }
  };

  const handleChangeTransfer = (e) => {
    // Update the inputValue state when the input value changes
    setTransferData({ ...transferData, [e.target.name]: e.target.value });
  };

  const handleSubmitTransferAmount = async () => {
    if (transferData.amount == 0) {
      alert("Amount should be >= 0");
    } else if (transferData.recipientAddress == "") {
      alert("Recipient address should be populated!");
    } else {
      if (
        typeof window.ethereum === "undefined" ||
        !window.ethereum.isMetaMask
      ) {
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
            .transferMoney(transferData.amount, transferData.recipientAddress)
            .encodeABI(),
        }; // call to contract method

        // txHash is a hex string
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        console.log("Transaction Hash:", txHash);
      } catch (error) {
        console.error(
          "Error while trying to execute withdrawal function:",
          error
        );
      }
    }
  };

  const loadClients = async () => {
    try {
      const clientFactory = new web3.eth.Contract(
        ClientFactoryABI.abi,
        clientFactoryAddress
      );

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(accounts[0]);
      const existAccount = await clientFactory.methods
        .doesClientExistInTheList()
        .call({ from: accounts[0] });

      setAccountFound(existAccount);
    } catch (error) {
      console.error("Error while loading client list:", error);
    }
  };

  useEffect(() => {
    if (web3) {
      loadClients();
    }
  }, [web3]);

  // loadClients();

  return (
    <div>
      <h1>TRANSACTIONS</h1>
      {!accountFound ? (
        <p style={{ color: "red" }}>You are not in the list!</p>
      ) : (
        <div className="form-container">
          <form
            onSubmit={handleSubmitWithdrawalAmount}
            className="form-withdraw"
          >
            <h2>Withdraw money</h2>
            <input id="address" name="address" value={account} disabled />
            <input
              id="amount"
              name="amount"
              onChange={handleChangeWithdraw}
              placeholder="Enter amount"
            />
            <button className="withdraw_money" type="submit">
              Submit
            </button>
          </form>

          <form onSubmit={handleSubmitTransferAmount} className="form-transfer">
            <h2>Transfer money</h2>
            <input
              type="addressSender"
              id="addressSender"
              name="addressSender"
              value={account}
              disabled
              onChange={handleChangeTransfer}
            />

            <input
              id="amountTranfer"
              name="amount"
              placeholder="Enter amount"
              onChange={handleChangeTransfer}
            />
            <input
              id="recipientAddress"
              name="recipientAddress"
              placeholder="Enter address of recipient"
              onChange={handleChangeTransfer}
            />
            <button className="transfer_money" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Transaction;
