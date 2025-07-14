import { Router, type Request, type Response } from "express";
import ipfs from "../lib/ipfs";
import { proxySchema } from "../utils/validator";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { cid } = proxySchema.parse(req.query);
    const chunks: Buffer[] = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    res.set("Content-Type", "application/octet-stream");
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Proxy failed", details: (error as Error).message });
  }
});

export default router;
