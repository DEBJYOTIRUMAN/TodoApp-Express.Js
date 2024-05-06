import Joi from 'joi';
import { User } from '../models/index.js';
import bcrypt from 'bcrypt';


const authController = {
    getLogin(req, res, _next) {
        if (req.session.user) {
            return res.redirect("/home");
        }

        res.render('login', { title: "Login" });
    },

    async postLogin(req, res, _next) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return res.render('login', { title: "Login", error: "Login Failed!", errorMsg: "Invalid email or password. Please try again." });
        }

        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.render('login', { title: "Login", error: "Login Failed!", errorMsg: "Email or password is wrong. Please try again." });
            }

            const match = await bcrypt.compare(req.body.password, user.password);

            if (!match) {
                return res.render('login', { title: "Login", error: "Login Failed!", errorMsg: "Email or password is wrong. Please try again." });
            }

            const { password, __v, ...userData } = user.toObject();
            req.session.user = userData;
            res.redirect("/home");

        } catch (err) {
            return res.render('login', { title: "Login", error: "Login Failed!", errorMsg: "Internal server error. Please try again later." });
        }
    },

    getRegister(req, res, _next) {
        if (req.session.user) {
            return res.redirect("/home");
        }

        res.render('register', { title: "Register" });
    },

    async postRegister(req, res, _next) {
        const registerSchema = Joi.object({
            name: Joi.string().pattern(new RegExp('^[a-zA-Z ]{3,30}$')).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = registerSchema.validate(req.body);

        if (error) {
            return res.render('register', { title: "Register", error: "Register Failed!", errorMsg: "Invalid name, email, or password. The name must be between 3 and 30 characters long. Please try again." });
        }

        try {
            const exist = await User.exists({ email: req.body.email });

            if (exist) {
                return res.render('register', { title: "Register", error: "Register Failed!", errorMsg: "This email is already taken. Please try another email." });
            }
        } catch (err) {
            return res.render('register', { title: "Register", error: "Register Failed!", errorMsg: "Internal server error. Please try again later." });
        }

        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        try {
            const newUser = await user.save();
            const { password, __v, ...userData } = newUser.toObject();
            req.session.user = userData;
            res.redirect("/home");

        } catch (err) {
            return res.render('register', { title: "Register", error: "Register Failed!", errorMsg: "Internal server error. Please try again later." });
        }
    },

    logout(req, res, _next) {
        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/home');
            }
            
            res.clearCookie('connect.sid');

            res.redirect('/');
        });
    },
};

export default authController;