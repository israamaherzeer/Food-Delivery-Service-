import { Category } from "../models/Category.js";

const createCategoryController = async (name: string) => {
    try {

        const category = new Category({
            name
        });

        const savedCategory = await category.save();

        return {
            savedCategory
        };

    } catch (error) {
        console.error(error);
        throw ("Something went wrong during customer signup");
    }
}

export {
    createCategoryController
}