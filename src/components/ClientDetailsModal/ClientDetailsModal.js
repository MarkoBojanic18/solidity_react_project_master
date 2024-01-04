import React, { useState, useEffect } from "react";
import ClientABI from "../../contracts/Client.json";
import "./ClientDetailsModal.css";
import manPicture from "../../assets/man.png";
import femalePicture from "../../assets/female.png";

const ClientDetailsModal = ({ client, onClose, web3, account }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clientAccount, setClientAccount] = useState(account);
  const [admin, setAdmin] = useState("");
  const [gender, setGender] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  const loadClientDetails = async () => {
    if (web3 && client) {
      const clientContract = new web3.eth.Contract(ClientABI.abi, client);

      const firstName = await clientContract.methods.getFirstName().call();
      const lastName = await clientContract.methods.getLastName().call();
      const clientAccount = await clientContract.methods.getAccount().call();
      const admin = await clientContract.methods.isAdmin().call();
      const gender = await clientContract.methods.getGender().call();
      const accountBalance = await clientContract.methods
        .getAccountBalance()
        .call();

      setFirstName(firstName);
      setLastName(lastName);
      setClientAccount(clientAccount);
      if (admin) {
        setAdmin("true");
      } else {
        setAdmin("false");
      }
      setGender(gender);
      setAccountBalance(accountBalance + "");
    }
  };

  useEffect(() => {
    loadClientDetails();
  }, [web3, client]);

  return (
    <div>
      {clientAccount.toLowerCase() == account ? (
        <div className="client-details-modal">
          <h2 className="modal-title">Client Details</h2>

          <img src={gender === "male" ? manPicture : femalePicture} alt="" />
          <p className="client-info">Client address: {clientAccount}</p>
          <table>
            <tr>
              <td>Client full name:</td>
              <td>{firstName + " " + lastName}</td>
            </tr>
            <tr>
              <td>Is admin:</td>
              <td>{admin}</td>
            </tr>
            <tr>
              <td>Gender:</td>
              <td>{gender}</td>
            </tr>
            <tr>
              <td>Account balance:</td>
              <td>{accountBalance}</td>
            </tr>
          </table>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <div>
          <h1>You can't see this account!</h1>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};
export default ClientDetailsModal;
