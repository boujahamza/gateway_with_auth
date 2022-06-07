require("dotenv").config();
require("./config/database").connect();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const express = require('express');

const app = express();
const router = require('./routes/articlesRouter.js');
const gameRouter = require('./routes/gameReviewsRouter.js');
const userInfoRouter = require("./routes/userInfoRouter");
const searchRouter = require("./routes/searchRouter");
const feedRouter = require('./routes/feedRouter');


//Cors rule

app.use(cors());
app.use(express.json());

app.use('/article',router.ArticleRouter);
app.use('/images',router.ImageRouter);
app.use('/events',router.EventRouter);
app.use('/games',gameRouter);
app.use('/user',userInfoRouter);
app.use('/search', searchRouter);
app.use('/feed', feedRouter);




//Duration of user session before expiration of token (must be in hours!)
let sessionLength = "1h";

const User = require("./model/user");

//Check if admin user exists. If not, create one
async function createAdmin(){
    var admin = await User.findOne({username:"admin", email:"admin"})
    if(!admin){
        await User.create({
            username:"admin",
            email:"admin",
            password: await bcrypt.hash("admin", 10),
            role:"admin"
        }).then(value => console.log("admin created"), error => {console.log(error)});
    }
}

createAdmin();
//---------------------------------------

app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!(username && email && password)) {
            res.status(400).send("All inputs are required");
        }

        // TODO: better way to do this -----------------------
        var oldUser = await User.findOne({ email: email });

        if (oldUser) {
            return res.status(409).send("User with this email already Exists");
        }

        oldUser = await User.findOne({ username: username });

        if (oldUser) {
            return res.status(409).send("User with this username already Exists");
        }
        //----------------------------------------------------

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const token = jwt.sign(
            {
                user_id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.TOKEN_KEY, //TODO: how can this be more secure?
            {
                expiresIn: sessionLength
            }
        );

        user.token = token;

        res.status(201).json({
            "user": user,
            "expiresIn": Number(sessionLength.slice(0, -1)) * 3600 * 1000,
        })
    } catch (err) {
        console.log(err);
        //TODO: response with error code
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("All inputs are required");
            return
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {
                    user_id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: sessionLength,
                }
            );

            user.token = token;

            res.status(200).json({
                "user": user,
                "expiresIn": Number(sessionLength.slice(0, -1)) * 3600 * 1000,
            });
        } else {
            console.log("Invalid Credentials");
            res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }
});

app.get("/:user_id/username",async (req,res) => {
    let user = await User.findById(req.params.user_id);
    if(user){
        res.status(200).json({username:user.username});
    }else{
        res.status(400).send("user not found");
    }
})

const auth = require("./middleware/auth");
const validateRole = require("./middleware/roleValidation");

app.get("/users/count", auth, validateRole, async (req,res)=> {
    console.log("recieved request for number of users");
    const number = await User.find().count();
    res.status(200).send(number.toString());
});

app.get("/users", auth, validateRole, async (req,res)=> {
    console.log("recieved request for list of users");
    let users = await User.find();
    users = users.map(user => {
        user.password = "";
        return user;
    })
    res.status(200).send(users);
});

const { API_PORT } = process.env;
const port = API_PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})