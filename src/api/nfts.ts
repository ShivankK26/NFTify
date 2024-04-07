import { NextApiRequest, NextApiResponse } from "next";
import { NFT } from "models/nftModel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { nftMinted, walletAddress } = req.body;
    const nft = new NFT({ nftMinted, walletAddress });

    await nft.save();
    res.status(201).json({ message: "NFT Created", data: nft });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
