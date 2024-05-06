import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from "cors";
import routes from "./routes/index.js";
import { create } from 'express-handlebars';
import session from "express-session";
import moment from 'moment';
import flash from 'connect-flash';

const app = express();

const hbs = create({
    helpers: {
        eq: (v1, v2) => v1 === v2,
        ne: (v1, v2) => v1 !== v2,
        and: (v1, v2) => v1 && v2,
        dateFormat: (date, format) => moment(date).format(format),
        inc: (value) => parseInt(value, 10) + 1,
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(session({
    secret: 'todoapp-express',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    }
}));

app.use(flash());

app.use(cors());

app.use(express.static('public'))

dotenv.config();

const APP_PORT = process.env.PORT || 3000;


async function connectDB() {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB Connected");
}

connectDB().catch(err => console.log(err));

app.use("/", routes);

app.listen(APP_PORT, () => {
    console.log(`Todo App Listening on Port ${APP_PORT}`)
})