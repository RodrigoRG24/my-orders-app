import ProductModel from "../models/ProductModel.js";

export const getAllProducts = async (req,res) =>{
    try {
        const products = await ProductModel.findAll()
        res.json(products)
    }catch(error){
        res.json({message:error.message})
    }
}

export const getProduct = async (req,res) => {
    try {
        const product = await ProductModel.findAll({
            where:{id:req.params.id}
        })
        res.json(product[0])
    } catch (error) {
        res.json({message:error.message})
    }
}

export const createProduct = async (req,res) => {
    try {
        await ProductModel.create(req.body)
        res.json({"message":"Product created!"})
    } catch (error) {
        res.json({message:error.message})
    }
}

export const updateProduct = async (req,res) => {
    try {
        await ProductModel.update(req.body,{
            where:{id:req.params.id}
        })
        res.json({"message":"Product updated!"})
    } catch (error) {
        res.json({message:error.message})
    }
}

export const deleteProduct = async (req,res) =>{
    try {
        await ProductModel.destroy({
            where:{id:req.params.id}
        })
        res.json({"message":"Product deleated!"})
    } catch (error) {
        res.json({message:error.message})
    }
}