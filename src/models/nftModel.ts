import mongoose from "mongoose";

const nftSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
  },
});

export const NFT = mongoose.model("NFT", nftSchema);
