"use client";
import React, { useEffect, useState } from "react";
import { providers } from "@massalabs/wallet-provider"; // WALLET-PROVIDER
import { ClientFactory, Args } from "@massalabs/massa-web3";
import { toast } from "react-toastify";

function App() {
  const [walletStatus, setWalletStatus] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [client, setClient] = useState(null);

  // const collection_contract =
  //   "AS14GWghYbMKjsHanReuGHgyaVoLmNiox6Q6zd6YbpAnDsJzPwHC";

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

  async function MassaStationCheck() {
    try {
      const bearbyWallet = await getWallet("BEARBY");
      const stationWallet = undefined;

      const handleWallet = async (wallet) => {
        if (!wallet) return;
        const selectedAccount = await wallet.accounts();
        let currentAccount;
        setWalletStatus(true);
        currentAccount = selectedAccount[0]; // Default current account
        setWallet(currentAccount);

        const massaClient = await ClientFactory.fromWalletProvider(
          wallet,
          currentAccount
        );
        setClient(massaClient);
      };

      if (stationWallet && !bearbyWallet) {
        handleWallet(stationWallet);
      } else if (!stationWallet && bearbyWallet) {
        handleWallet(bearbyWallet);
      } else {
        setWalletStatus(false);
      }

      console.log(bearbyWallet);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    MassaStationCheck();
  }, []);

  const handleJoinLobby = async () => {
    if (walletStatus) {
      await client
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
    }
  };

  return (
    <>
      <div>{!walletStatus && <div>Wallet not found</div>}</div>

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
