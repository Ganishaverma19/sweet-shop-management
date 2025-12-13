import { Request, Response } from "express";
import prisma from "../lib/prisma";


export const addSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;

    // ✅ basic validation
    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sweet = await prisma.sweet.create({
      data: {
        name,
        category,
        price: Number(price),
        quantity: Number(quantity),
      },
    });

    return res.status(201).json(sweet);
  } catch (error) {
    console.error("ADD SWEET ERROR:", error);
    return res.status(500).json({ message: "Failed to add sweet" });
  }
};
   
  

export const getAllSweets = async (_req: Request, res: Response) => {
  try {
    const sweets = await prisma.sweet.findMany();
    res.json(sweets);
  } catch {
    res.status(500).json({ message: "Failed to fetch sweets" });
  }
};


export const searchSweets = async (req: Request, res: Response) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const sweets = await prisma.sweet.findMany({
      where: {
        name: name
          ? { contains: String(name) }
          : undefined,
        category: category
          ? { contains: String(category) }
          : undefined,
        price: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? 
          
          
          Number(maxPrice) : undefined
        }
      }
    });

    res.json(sweets);
  } catch {
    res.status(500).json({ message: "Search failed" });
  }
};



 export const updateSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, price } = req.body;

    const sweet = await prisma.sweet.update({
      where: { id: Number(id) },
      data: { name, category, price },
    });

    res.json(sweet);
  } catch {
    res.status(400).json({ message: "Update failed" });
  }
};


export const deleteSweet = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.sweet.delete({ where: { id } });
    res.json({ message: "Sweet deleted" });
  } catch {
    res.status(404).json({ message: "Sweet not found" });
  }
};




export const purchaseSweet = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const sweet = await prisma.sweet.findUnique({ where: { id } });
    if (!sweet || sweet.quantity <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    const updated = await prisma.sweet.update({
      where: { id },
      data: { quantity: sweet.quantity - 1 }
    });

    res.json(updated);
  } catch {
    res.status(404).json({ message: "Sweet not found" });
  }
};


export const restockSweet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const sweet = await prisma.sweet.update({
    where: { id: Number(id) },
    data: {
      quantity: { increment: Number(quantity) },
    },
  });

  res.json(sweet);
};

