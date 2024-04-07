import { PublicKey } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useNetworkConfiguration } from "contexts/NetworkConfigurationProvider";
import Image from "next/image";
import { FC, useCallback, useState } from "react";
import { mintWithMetaplexJs } from "utils/metaplex";
import { notify } from "utils/notifications";

const TOKEN_NAME = "Solana Workshop NFT";
const TOKEN_SYMBOL = "SHOP";
const TOKEN_DESCRIPTION = "NFT minted in the NFT Minter workshop!";
const WORKSHOP_COLLECTION = new PublicKey(
  "CPpyd2Uq1XkCkd9KHswjttdQXTvZ4mmrnif3tXg9i8sk",
);

export const NftMinter: FC = () => {
  const { connection } = useConnection();
  const { networkConfiguration } = useNetworkConfiguration();
  const wallet = useWallet();

  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const [mintAddress, setMintAddress] = useState(null);
  const [mintSignature, setMintSignature] = useState(null);

  const uploadImage = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const uploadedImage = event.target.files[0];
      setImage(uploadedImage);
      setCreateObjectURL(URL.createObjectURL(uploadedImage));
      const body = new FormData();
      body.append("file", uploadedImage);
      await fetch("/api/upload", {
        method: "POST",
        body,
      }).catch((res) => {
        notify({ type: "error", message: `Upload failed!`, description: res });
        console.log("error", `Upload failed! ${res}`);
      });
    }
  };

  const onClickMintNft = useCallback(async () => {
    if (!wallet.publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }
    await mintWithMetaplexJs(
      connection,
      networkConfiguration,
      wallet,
      TOKEN_NAME,
      TOKEN_SYMBOL,
      TOKEN_DESCRIPTION,
      WORKSHOP_COLLECTION,
      image,
    ).then(([mintAddress, signature]) => {
      setMintAddress(mintAddress);
      setMintSignature(signature);
    });
  }, [wallet, connection, networkConfiguration, image]);

  return (
    <div>
      <div className="mx-auto flex flex-col">
        {createObjectURL && (
          <Image
            className="mx-auto mb-4"
            alt="uploadedImage"
            width="300"
            height="300"
            src={createObjectURL}
          />
        )}
        {!mintAddress && !mintSignature && (
          <div className="mx-auto mb-2 text-center">
            <input className="mx-auto" type="file" onChange={uploadImage} />
          </div>
        )}
      </div>
      <div className="flex flex-row justify-center">
        <div className="group relative items-center">
          {createObjectURL && !mintAddress && !mintSignature && (
            <div>
              <div
                className="animate-tilt absolute -inset-0.5 m-1 rounded-lg bg-gradient-to-r
                        from-purple-300 to-purple-500 opacity-20 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"
              ></div>
              <button
                className="btn m-2 mt-4 h-14 w-40 animate-pulse bg-gradient-to-br from-purple-300 to-purple-500 px-8 text-lg text-black hover:from-white hover:to-pink-700"
                onClick={onClickMintNft}
              >
                <span>Mint!</span>
              </button>
            </div>
          )}

          {mintAddress && mintSignature && (
            <div>
              <h4 className="text-2x1 my-2 text-center text-slate-300 md:w-full md:text-4xl">
                <p>Mint successful!</p>
                <p className="mt-4 mb-2 text-lg text-xl">
                  Mint address:{" "}
                  <span className="font-bold text-pink-500">
                    <a
                      className="border-b-2 border-transparent hover:border-pink-500"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://explorer.solana.com/address/${mintAddress}?cluster=${networkConfiguration}`}
                    >
                      {mintAddress}
                    </a>
                  </span>
                </p>
                <p className="text-xl">
                  Tx signature:{" "}
                  <span className="font-bold text-purple-600">
                    <a
                      className="border-b-2 border-transparent hover:border-purple-600"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://explorer.solana.com/tx/${mintSignature}?cluster=${networkConfiguration}`}
                    >
                      {mintSignature}
                    </a>
                  </span>
                </p>
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
