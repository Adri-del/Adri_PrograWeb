import  type { Request, Response } from "express";
import pool from "../conf/dbConnection.ts";

export class ProductController {

    getProducts = async (req:Request, res:Response) => {
        try{
            const [rows]: any = await pool.execute(
                "SELECT * FROM products WHERE active = TRUE"
            );
            res.status(200).json(rows);
        } catch (error) {
            console.error("Error al consultar productos:", error);
            res.status(500).json({message: "Internal Server Error"})
        }
    }

    getProductById = async (req:Request, res:Response) => {
        try{
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({message: "Invalid ID"});
                return;
            }

            const [rows]: any = await pool.execute(
                "SELECT * FROM products WHERE id = ? AND active = TRUE",
                [id]
            );

            if (rows.length === 0) {
                res.status(404).json({message: "Product not found"});
                return;
            }

            res.status(200).json(rows[0]);
        }catch(error){
            res.status(500).json({message: "Internal Server Error"})
        }
    }

    createProduct = async (req: Request, res: Response) => {
        try {
            const {name, price, stock, description, brand, img } = req.body;

            if (
                typeof name !== "string" || !name.trim() ||
                typeof description !== "string" || !description.trim() ||
                !Number.isInteger(stock) || stock < 0 ||
                typeof price !== "number" ||
                !Number.isFinite(price) || price <= 0 ||
                (brand !== undefined && brand !== null &&
                    typeof brand !== "string") ||
                (img !== undefined && img !== null &&
                    typeof img !== "string")
            ) {
                res.status(400).json({message: "Invalid input data"});
                return;
            }

            const [result]: any = await pool.execute(
                `INSERT INTO products
                (name, price, stock, description, brand, img)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    name.trim(),
                    price,
                    stock,
                    description.trim(),
                    brand ?? null,
                    img ?? null
                ]
            );

        res.status(201).json({ message: "Product created"});

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    updateProductById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({message: "Invalid ID"});
                return;
            }

            const {name, price, stock, description, brand, img } = req.body;

            if (
                typeof name !== "string" || !name.trim() ||
                typeof description !== "string" || !description.trim() ||
                !Number.isInteger(stock) || stock < 0 ||
                typeof price !== "number" ||
                !Number.isFinite(price) || price <= 0 ||
                (brand !== undefined && brand !== null &&
                    typeof brand !== "string") ||
                (img !== undefined && img !== null &&
                    typeof img !== "string")
            ) {
                res.status(400).json({message: "Invalid input data"});
                return;
            }

            const [existing]: any = await pool.execute(
                "SELECT id FROM products WHERE id = ? AND active = TRUE",
                [id]
            );

            if (existing.length === 0) {
                res.status(404).json({message: "Product not found" });
                return;
            }

            await pool.execute(
                `UPDATE products
                SET name = ?, price = ?, stock = ?,
                    description = ?, brand = ?, img = ?
                WHERE id = ? AND active = TRUE`,
                [
                    name.trim(),
                    price,
                    stock,
                    description.trim(),
                    brand ?? null,
                    img ?? null,
                    id
                ]
            );

            res.status(200).json({message: "Product updated"});


        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

  deleteProductById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({message: "Invalid ID"});
            return;
        }

        const [existing]: any = await pool.execute(
            "SELECT id FROM products WHERE id = ? AND active = TRUE",
            [id]
        );

        if (existing.length === 0) {
            res.status(404).json({message: "Product not found" });
            return;
        }

        await pool.execute(
            "UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE",
            [id]
        );

        res.status(200).json({message: "Product deleted"});
            
    }catch(error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
  }

  changeProductPriceById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { price } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({message: "Invalid ID"});
            return;
        }

        if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
            res.status(400).json({message: "Invalid price"});
            return;
        }

        const [existing]: any = await pool.execute(
            "SELECT id FROM products WHERE id = ? AND active = TRUE",
            [id]
        );

        if (existing.length === 0) {
            res.status(404).json({message: "Product not found" });
            return;
        }

        await pool.execute(
            "UPDATE products SET price = ? WHERE id = ? AND active = TRUE",
            [price, id]
        );

        res.status(200).json({message: "Product price updated"});
    }catch(error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
  }

}