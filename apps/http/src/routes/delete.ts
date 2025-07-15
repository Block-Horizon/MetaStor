import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const deleteSchema = z.object({
  fileId: z.number(),
});

const router = Router();
router.use(authMiddleware);

router.post("/", async (req: Request, res: Response) => {
  try {
    const { fileId } = deleteSchema.parse(req.body);
    const pubKey = req.user!.pubKey;
    const user = await prisma.user.findUnique({ where: { pubKey } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file || file.userId !== user.id) {
      return res.status(404).json({ error: "File not found or not owned" });
    }
    await prisma.file.update({
      where: { id: fileId },
      data: { deleted: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Delete failed", details: (error as Error).message });
  }
});

export default router;
