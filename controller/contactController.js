import Joi from 'joi';
import { Contact } from "../models/index.js";

const contactController = {
    getContact(req, res, _next) {
        if (!req.session.user) {
            return res.redirect("/");
        }

        res.render('contact', { title: "Contact" });
    },

    async postContact(req, res, _next) {
        if (!req.session.user) {
            return res.redirect("/");
        }

        const contactSchema = Joi.object({
            name: Joi.string().pattern(new RegExp('^[a-zA-Z ]{3,30}$')).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
            message: Joi.string().required(),

        });

        const { error } = contactSchema.validate(req.body);

        if (error) {
            return res.render('contact', { title: "Contact", error: "Contact Failed!", errorMsg: "Invalid name, email, phone, or message. Your name must be between 3 and 30 characters long and phone number must be 10-digit valid number. Please try again." });
        }

        const { name, email, phone, message } = req.body;

        const contact = new Contact({
            name,
            email,
            phone,
            message,
        });

        try {
            await contact.save();

        } catch (err) {
            return res.render('contact', { title: "Contact", error: "Contact Failed!", errorMsg: "Internal server error. Please try again later." });
        }

        res.render('contact', { title: "Contact", success: "Thank You.", successMsg: "We will get back to you as soon as possible." });
    }
}
export default contactController;