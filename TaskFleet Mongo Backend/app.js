const http = require('http');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid");
const Router = require("./Routes/server.routes");
const passport = require("./Gauth/google.auth");
const User = require("./Model/user.model");
const setupSocket = require('./Socket/socket');
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
app.use("/", Router);

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
        session: false,
    }),
    async function (req, res) {
        const isUserExits = await User.findOne({ email: req.user.emails[0].value })
        if (isUserExits) {
            const token = jwt.sign({ userId: isUserExits._id }, "JWT_SECRET", { expiresIn: '7d' });
            res.redirect(`https://task-fleet.vercel.app/callback?token=${token}`)
        }
        else {
            console.log(req.user);
            console.log("SignUP");
            let user = User({
                username: req.user.displayName,
                email: req.user.emails[0].value,
                password: uuidv4(),
                userProfile: req.user.photos[0].value
            })
            await user.save();
            console.log(user);
            const token = jwt.sign({ userId: user._id }, "JWT_SECRET", { expiresIn: '7d' });
            res.redirect(`https://task-fleet.vercel.app/callback?token=${token}`)
        }
    }
);

server.listen(8080, async () => {
    setupSocket(server);
    await mongoose.connect(
        "mongodb+srv://laxya:laksh@cluster0.zwu6tqa.mongodb.net/PorjectHUB?retryWrites=true&w=majority"
    );
    console.log("server started on 8080");
});
