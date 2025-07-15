import { Router, type Request, type Response } from "express";
import multer from "multer";
import ipfs from "../lib/ipfs";
import prisma from "../lib/prisma";
import { prepareTransferTx } from "../lib/solana";
import { authMiddleware } from "../middleware/auth";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1 * 1024 * 1024 },
});

const router = Router();
router.use(authMiddleware);

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const pubKey = req.user!.pubKey; // From JWT
    if (!file) {
      return res.status(400).json({ error: "Missing file" });
    }

    const buffer = await Bun.file(file.path).arrayBuffer();
    const { cid } = await ipfs.add(
      { content: Buffer.from(buffer) },
      { pin: true }
    );
    const user = await prisma.user.findUnique({ where: { pubKey } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newFile = await prisma.file.create({
      data: {
        userId: user.id,
        fileName: file.originalname,
        cid: cid.toString(),
      },
    });

    const tx = await prepareTransferTx(pubKey, 0.001);
    const txSerialized = tx
      .serialize({ requireAllSignatures: false, verifySignatures: false })
      .toString("base64");

    res.json({ txSerialized, fileId: newFile.id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Upload failed", details: (error as Error).message });
  }
});

export default router;
