import Ingredient from "../models/Ingredient.js";
import fs from "fs";
import csv from "csv-parser";
import xlsx from "xlsx";

export const createIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);

    res.status(201).json({
      success: true,
      ingredient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find();

    res.json({
      success: true,
      ingredients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bulkUploadIngredients = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    let ingredients = [];

    // CSV Upload
    if (req.file.originalname.endsWith(".csv")) {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("end", async () => {
          ingredients = results;

          await processIngredients(
            ingredients,
            res
          );
        });
    }

    // Excel Upload
    else {
      const workbook = xlsx.readFile(filePath);

      const sheetName =
        workbook.SheetNames[0];

      const worksheet =
        workbook.Sheets[sheetName];

      ingredients =
        xlsx.utils.sheet_to_json(worksheet);

      await processIngredients(
        ingredients,
        res
      );
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const processIngredients = async (
  ingredients,
  res
) => {
  try {
    const formattedIngredients =
      ingredients.map((item) => ({
        name: item.name,
        category: item.category || "",
        unit: item.unit || "",
        calories: item.calories || 0,
        protein: item.protein || 0,
        carbs: item.carbs || 0,
        fat: item.fat || 0,
      }));

    // Remove duplicates
    const existingIngredients =
      await Ingredient.find({
        name: {
          $in: formattedIngredients.map(
            (i) => i.name
          ),
        },
      });

    const existingNames =
      existingIngredients.map(
        (i) => i.name
      );

    const newIngredients =
      formattedIngredients.filter(
        (i) =>
          !existingNames.includes(i.name)
      );

    await Ingredient.insertMany(
      newIngredients
    );

    res.json({
      success: true,
      totalUploaded:
        newIngredients.length,
      message:
        "Ingredients uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};