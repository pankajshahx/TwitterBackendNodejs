const router = require("express").Router();
const User = require("../modules/TwitterUser");
const bcrypt = require("bcrypt");

//register
router.post("/register", async (req, res) => {
    try {
        // generate password
        const generatSalt = await bcrypt.genSalt(10);
        const strongPassword = await bcrypt.hash(req.body.password, generatSalt);

        // generate new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: strongPassword,
        });


        // save user and return response 
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }

    await User.save();
    res.send("Successfully register");
});


//Sign in
router.post("login", async (req, res) => {
    try {
        const user = await User.findOne({ eamil: req.body.email });
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")

        req.session.user = req.body.email;
        res.status(200).json(user)
    } catch (err) {
        console.log(err);
    }
});


//logout session
router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.send("Sign Out");
});

module.exports = router;