import express from "express"
import support from "../controller/support.js"
import Admin from "../model/admin.js"
import jwt from "jsonwebtoken"
import { GetUser } from "../services/auth.js"

const main = express.Router()

// Middleware to check if user is logged in
async function checkUser(req, res, next) {
    let UserId = req.cookies?.uid
    if (UserId) {
        let user = GetUser(UserId)
        if (user) {
            req.user = user
        }
    }
    next()
}

main.get('/', checkUser, async(req, res) => {
    let ad = await Admin.findOne()
    res.render("index", {server:ad.ip, port:ad.port, banner:ad.discord_banner, user: req.user})
})

main.get('/home', checkUser, async (req, res) => {
const ad = await Admin.findOne()
    res.render("index", {server:ad.ip, port:ad.port, banner:ad.discord_banner, user: req.user})
    })
main.get('/discord',async (reg, res)=>{
    const ad = await Admin.findOne()
        res.redirect(ad.discord_link)
    })
main.get('/test-cookies', (req, res) => {
        console.log(req.cookies); // Should log the full cookies object
        res.send(req.cookies.uid ? 'Cookie found' : 'No cookie');
    });
    
main.get('/support', checkUser, (req, res)=>{
        res.render("support", {user: req.user})
}).post("/support-send", support)
    

export default main