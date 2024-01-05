import React, { useState, useEffect } from "react";
import ClientFactoryABI from "../../contracts/ClientFactory.json";
import "./Transaction.css";

const Transaction = ({ web3, account, clientFactoryAddress }) => {
  const [clients, setClients] = useState([]);
  const [accountFound, setAccountFound] = useState(false);

  const loadClients = async () => {
    try {
      const clientFactory = new web3.eth.Contract(
        ClientFactoryABI.abi,
        clientFactoryAddress
      );

      const clientsFromContract = await clientFactory.methods
        .getAllClients()
        .call();

      const existAccount = await clientFactory.methods
        .doesClientExistInTheList(account)
        .call();

      console.log(existAccount);
      setClients(clientsFromContract);
    } catch (error) {
      console.error("Error while loading client list:", error);
    }
  };

  useEffect(() => {
    if (web3) {
      loadClients();
    }
  }, [web3]);

  return (
    <div>
      <h1>TRANSACTIONS</h1>
      <div class="form-container">
        <form class="form-withdraw">
          <h2>Withdraw money</h2>
          <input id="address" name="address" value={account} disabled />
          <input id="amount" name="amount" placeholder="Enter amount" />
          <button className="withdraw_money" type="submit">
            Submit
          </button>
        </form>

        <form class="form-transfer">
          <h2>Transfer money</h2>
          <input
            type="addressSender"
            id="addressSender"
            name="addressSender"
            value={account}
            disabled
          />

          <input
            id="amountTranfer"
            name="amountTransfer"
            placeholder="Enter amount"
          />
          <input
            id="purpuseOfTransfer"
            name="purpuseOfTransfer"
            placeholder="Enter transfer purpose"
          />
          <input
            id="recipientAddress"
            name="recipientAddress"
            placeholder="Enter address of recipient"
          />
          <button className="transfer_money" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transaction;
