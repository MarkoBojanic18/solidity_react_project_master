import React, { useState, useEffect } from "react";
import ClientFactoryABI from "../../contracts/ClientFactory.json";
import ClientDetailsModal from "../ClientDetailsModal/ClientDetailsModal.js";
import "./ClientList.css";

const ClientList = ({ web3, account, clientFactoryAddress }) => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const loadClients = async () => {
    try {
      const clientFactory = new web3.eth.Contract(
        ClientFactoryABI.abi,
        clientFactoryAddress
      );

      const clientsFromContract = await clientFactory.methods
        .getAllClients()
        .call();
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

  const openDetailsModal = (client) => {
    setSelectedClient(client);
  };

  return (
    <div className="client-list">
      <h1 className="client-list-title">Client Dapp</h1>
      {clients.map((client, index) => (
        <div
          key={index}
          className="client-item"
          onClick={() => openDetailsModal(client)}
        >
          {index + 1}
        </div>
      ))}
      {selectedClient && (
        <ClientDetailsModal
          web3={web3}
          account={account}
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
};

export default ClientList;
