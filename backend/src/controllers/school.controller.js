import pool from "../db.js";
import { validationResult } from "express-validator";


export const addSchool = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Image is required", path: "image" }] });
    }

    const { name, address, city, state, contact, email_id } = req.body;

    const imageUrl = req.file.path;

    const sql = `
      INSERT INTO schools (name, address, city, state, contact, image, email_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [name, address, city, state, contact, imageUrl, email_id];

    await pool.execute(sql, params);

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      imageUrl
    });
  } catch (err) {
    console.error("Error inserting school:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getSchools = async (_req, res) => {
  try {
    const [schools] = await pool.query(
      "SELECT id, name, address, city, state, image FROM schools ORDER BY id DESC"
    );

    res.status(200).json({
      success: true,
      count: schools.length,
      data: schools
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch schools"
    });
  }
};
