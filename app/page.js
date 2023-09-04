"use client";
import React, { useEffect, useState } from "react";
import { providers } from "@massalabs/wallet-provider"; // WALLET-PROVIDER
import { ClientFactory, Args } from "@massalabs/massa-web3";
import { toast } from "react-toastify";

function App() {
  const race_contract = "AS1rhYAVDB586HJrPEozSghH9ra8ZYM7WwxFrLGRdJALPaTs8hjt";

  const getWallet = async (walletName) => {
    const wallets = await providers();
    const _wallet = wallets.find((wallet) => {
      if (wallet.name() === walletName) {
        return wallet;
      }
    });
    return _wallet;
  };

  const handleJoinLobby = async () => {
    const bearbyWallet = await getWallet("BEARBY");
    const selectedAccount = await bearbyWallet.accounts();
    const currentAccount = selectedAccount[0];
    const massaClient = await ClientFactory.fromWalletProvider(
      bearbyWallet,
      currentAccount
    );

    await massaClient
      .smartContracts()
      .callSmartContract({
        fee: BigInt(1000),
        maxGas: BigInt(1000000),
        coins: BigInt(0),
        targetAddress: race_contract,
        functionName: "enterLobby",
        parameter: new Args()
          .addU256(BigInt(13))
          .addString("1")
          .addI32(0)
          .addString("test time"),
      })
      .then((tx) => {
        console.log(tx);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <div className="w-3/5">
        <button
          onClick={handleJoinLobby}
          className="mt-4 w-full my-2 rounded-md bg-gray-800 px-5 py-2.5 text-base font-bold text-white hover:text-white"
        >
          join the first lobby
        </button>
      </div>
    </>
  );
}

export default App;
