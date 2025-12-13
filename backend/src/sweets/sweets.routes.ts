import { Router } from "express";

import {
  addSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from "./sweets.controller";

import {
  authMiddleware,
  adminOnly,
  userOnly
} from "../middleware/auth.middleware";


const router = Router();

// Any logged-in user
router.get("/", authMiddleware, getAllSweets);
router.get("/search", authMiddleware, searchSweets);

// ADMIN only
router.post("/", authMiddleware, adminOnly, addSweet);
router.put("/:id", authMiddleware, adminOnly, updateSweet);

router.delete("/:id", authMiddleware, adminOnly, deleteSweet);
router.post("/:id/restock", authMiddleware, adminOnly, restockSweet);
router.post("/", authMiddleware, adminOnly, addSweet);


// USER only
router.post("/:id/purchase", authMiddleware, userOnly, purchaseSweet);

export default router;
