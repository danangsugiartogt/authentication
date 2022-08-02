import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getProducts = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        else{
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                where:{
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if(!product) res.status(404).json({ msg: "Product not found."});

        let response;
        if(req.role === "admin"){
            response = await Product.findOne({
                attributes: ['uuid',' name', 'price'],
                where: {
                    id: product.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        else{
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;
        await Product.create({
            name: name,
            price: price,
            userId: req.userId
        });

        res.status(201).json({ msg: "Product created successfully."});
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if(!product) res.status(404).json({ msg: "Product not found."});

        const { name, price } = req.body;
        if(req.role === 'admin'){
            await Product.update({
                name: name,
                price: price
            }, {
                where: {
                    id: product.id
                }
            });
        }
        else{
            if(req.userId !== product.userId) res.status(403).json({ msg: "Access Denied."});
            await Product.update({
                name: name,
                price: price
            },{
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                }
            });
        }

        res.status(200).json({ msg: "Product updated successfully."});
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });

        if(!product) res.status(404).json({ msg: "Product not found."});

        if(req.role === 'admin'){
            await Product.destroy({
                where: {
                    id: product.id
                }
            });
        }
        else{
            if(req.userId !== product.userId) res.status(403).json({ msg: "Access Denied."});
            await Product.destroy({
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                }
            });
        }

        res.status(200).json({ msg: "Product deleted successfully."});
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};