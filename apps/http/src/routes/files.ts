import { Router, type Request, type Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: Request, res: Response) => {
  try {
    const pubKey = req.user!.pubKey; // From JWT
    const user = await prisma.user.findUnique({ where: { pubKey } });
    if (!user) {
      return res.json({ files: [] });
    }
    const files = await prisma.file.findMany({
      where: { userId: user.id, paid: true },
      orderBy: { timestamp: "desc" },
      take: 10,
    });
    res.json({ files });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Query failed", details: (error as Error).message });
  }
});

export default router;
