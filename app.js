import express from "express"
import mongoose from "mongoose"
import cors from 'cors'  // Add this import
import main from "./src/routes/main.js"
import auth from "./src/routes/user.js"
import store from "./src/routes/store.js"
import cookieParser from 'cookie-parser';
import admin from "./src/routes/admin.js"
import api from "./src/routes/api.js"

const app = express()
const port = 3000
mongoose.connect("mongodb+srv://drkvoid:drkvoid98280@mydicordbot.wsrhai6.mongodb.net/")

app.use(express.static("views"))
app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(cors());  // Add this line for CORS support
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/", main)
app.use("/", auth)
app.use("/", store)
app.use("/", admin)
app.use("/api", api)

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})
