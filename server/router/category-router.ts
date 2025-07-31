import { Router } from "express";
import { seedCategories } from "../controller/mentor-seed-categories";
import { getCategories } from "../controller/mentor-get-categories";
import { createCategory } from "../controller/mentor-create-categories";
import { addSubCategories } from "../controller/mentor-add-sub-categories";

export const CategoryRouter = Router();

CategoryRouter.post("/mentor-seed-category", seedCategories);
CategoryRouter.get("/mentor-get-category", getCategories);
CategoryRouter.post("/mentor-creat-category", createCategory)
CategoryRouter.post("/mentor-sub-category/:categoryId", addSubCategories)