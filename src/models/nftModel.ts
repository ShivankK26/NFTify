import mongoose from "mongoose";

const nftSchema = new mongoose.Schema({
  nftMinted: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
});

export const NFT = mongoose.model("NFT", nftSchema);
