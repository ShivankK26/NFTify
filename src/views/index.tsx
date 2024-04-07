// Next, React
import { FC, useEffect, useState } from "react";
import Link from "next/link";

// Wallet
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

// Components
// import { RequestAirdrop } from '../components/RequestAirdrop';

// Store
import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore";
import { NftMinter } from "components/NftMinter";

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="mx-auto p-4 md:hero">
      <div className="flex flex-col md:hero-content">
        <div className="mt-6">
          <h1 className="mx-auto mb-4 w-auto bg-gradient-to-br from-indigo-500 to-fuchsia-500 bg-clip-text text-center text-5xl font-bold text-transparent">
            Solana NFT Minting
          </h1>
        </div>
        <h4 className="text-2x1 my-2 text-center text-slate-300 md:w-full md:text-4xl">
          <p>Let's Mint Some NFTs!! 🚀</p>
        </h4>
        {wallet.connected ? (
          <div>
            <div className="mt-6 flex flex-col">
              <NftMinter />
            </div>
            <div className="mt-12 flex flex-col">
              {/* <RequestAirdrop /> */}
              <h4 className="my-2 text-2xl text-slate-300 md:w-full">
                {wallet && (
                  <div className="flex flex-row justify-center">
                    <div>{(balance || 0).toLocaleString()}</div>
                    <div className="ml-2 text-slate-600">SOL</div>
                  </div>
                )}
              </h4>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="mt-8 text-2xl text-slate-300 md:w-full">
              Connect Your Wallet!!
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};
