import { create } from "ipfs-http-client";

const ipfs = create({ url: process.env.IPFS_API_URL });

export default ipfs;
