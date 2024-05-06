import Joi from 'joi';
import { Todo } from '../models/index.js';

const todoController = {
    async getTodo(req, res, _next) {
        if (!req.session.user) {
            return res.redirect("/");
        }

        const allTodo = await Todo.find({ userId: req.session.user._id }).lean().exec();

        const error = req.flash('error');
        const errorMsg = req.flash('errorMsg');

        res.render('home', { title: "Home", allTodo, error: error.length > 0 ? error[0] : null, errorMsg: errorMsg.length > 0 ? errorMsg[0] : null });
    },

    async postTodo(req, res, _next) {
        if (!req.session.user) {
            return res.redirect("/");
        }

        const allTodo = await Todo.find({ userId: req.session.user._id }).lean().exec();

        const todoSchema = Joi.object({
            title: Joi.string().required(),
            desc: Joi.string().required(),
        });

        const { error } = todoSchema.validate(req.body);

        if (error) {
            return res.render('home', { title: "Home", allTodo, error: "Todo Failed!", errorMsg: "Invalid title or description. Please try again." });
        }

        const { title, desc } = req.body;

        let newTodo;

        try {
            newTodo = await Todo.create({
                userId: req.session.user._id,
                title,
                desc,
            });
        } catch (err) {
            return res.render('home', { title: "Home", allTodo, error: "Todo Failed!", errorMsg: "Internal server error. Please try again later." });
        }

        allTodo.push(newTodo.toObject());

        res.render('home', { title: "Home", allTodo });

    },

    async showTodo(req, res, _next) {
        if (!req.session.user) {
            return res.redirect("/");
        }

        let todo;

        try {
            todo = await Todo.findOne({ _id: req.params.id }).lean().exec();
        } catch (err) {
            req.flash('error', 'Todo showing failed!');
            req.flash('errorMsg', 'Internal server error. Please try again later.');

            return res.redirect("/home");
        }

        res.render('show', { title: "Show", todo });

    },

    async getUpdateTodo(req, res, _next) {
        if (!req.session.user) {
            return res.redirect("/");
        }

        let todo;

        try {
            todo = await Todo.findOne({ _id: req.params.id }).lean().exec();
        } catch (err) {
            req.flash('error', 'Update Failed!');
            req.flash('errorMsg', 'Internal server error. Please try again later.');


            return res.redirect("/home");
        }

        res.render('update', { title: "Update", todo });

    },

    async postUpdateTodo(req, res, _next) {

        if (!req.session.user) {
            return res.redirect("/");
        }

        let todo;

        try {
            todo = await Todo.findOne({ _id: req.params.id }).lean().exec();
        } catch (err) {
            req.flash('error', 'Update Failed!');
            req.flash('errorMsg', 'Internal server error. Please try again later.');

            return res.redirect("/home");
        }

        const todoSchema = Joi.object({
            title: Joi.string().required(),
            desc: Joi.string().required(),
        });

        const { error } = todoSchema.validate(req.body);

        if (error) {
            return res.render('update', { title: "Update", todo, error: "Update Failed!", errorMsg: "Invalid title or description. Please try again." });
        }

        const { title, desc } = req.body;

        try {
            await Todo.findOneAndUpdate(
                { _id: req.params.id },
                {
                    title,
                    desc,
                },
                { new: true }
            ).lean().exec();
        } catch (err) {
            return res.render('update', { title: "Update", todo, error: "Update Failed!", errorMsg: "Internal server error. Please try again later." });
        }

        res.redirect("/home");

    },

    async deleteTodo(req, res, _next) {
        if (!req.session.user) {
            return res.redirect("/");
        }

        const todo = await Todo.findOneAndDelete({ _id: req.params.id });

        if (!todo) {
            req.flash('error', 'Todo Failed!');
            req.flash('errorMsg', 'Something went wrong. Todo not found. Please try again.');

            return res.redirect("/home");
        }

        res.redirect("/home");
    },

    async getSearchTodo(_req, res, _next) {
        res.redirect("/home");
    },

    async postSearchTodo(req, res, _next) {
        if (!req.session.user) {
            return res.redirect("/");
        }

        if (!req.body.search) {
            req.flash('error', 'Todo Failed!');
            req.flash('errorMsg', 'Search is required. Please try again.');

            return res.redirect("/home");
        }

        let allTodo;

        try {
            allTodo = await Todo.find({
                userId: req.session.user._id,
                $or: [
                    { title: { $regex: req.body.search, $options: "i" } },
                    { desc: { $regex: req.body.search, $options: "i" } }
                ]
            }).lean().exec();

            if (allTodo.length === 0) {
                req.flash('error', 'Todo Failed!');
                req.flash('errorMsg', 'Invalid search. No todos found. Please search again.');

                return res.redirect("/home");
            }

        } catch (err) {
            req.flash('error', 'Todo Failed!');
            req.flash('errorMsg', 'Internal server error. Please try again later.');

            return res.redirect("/home");
        }

        res.render('home', { title: "Search", allTodo });
    },
};

export default todoController;