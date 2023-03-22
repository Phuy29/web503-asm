import { PrismaClient } from "@prisma/client";
import express from "express";
import * as z from "zod";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/product", async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
});

const createProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  status: z.string(),
});

app.post("/product", async (req, res) => {
  try {
    const body = createProductSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        status: body.status,
      },
    });

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error);
  }
});

const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});

app.put("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = updateProductSchema.parse(req.body);

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        status: body.status,
      },
    });

    return res.status(200).json("Update product successfully!");
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return res.status(200).json("Delete product successfully!");
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.listen(8080, () => {
  console.log("Server is running!");
});
