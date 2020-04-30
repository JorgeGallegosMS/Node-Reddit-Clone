const jwt = require('jsonwebtoken')
const User = require("../models/user")

module.exports = (app) => {
    // SIGN UP FORM
    app.get("/sign-up", (req, res) => {
        let currentUser = req.user
        res.render("sign-up", { title: "Sign Up", button: "Create Account", currentUser });
    });

    app.post("/sign-up", (req, res) => {
        const user = new User(req.body)

        user.save()
            .then(user => {
                let token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
                res.cookie('nToken', token, { maxAge: 900000, httpOnly: true })
                res.redirect("/");
            })
            .catch(err => {
                console.log(err.message);
                return res.status(400).send({ err: err})
            });
    });

    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        res.redirect('/');
    })

    app.get('/login', (req, res) => {
        let currentUser = req.user
        res.render('login', { title: "Login", button: "Login", currentUser });
    })

    app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

        // Try and find the user
        User.findOne({ username }, "username password")
            .then(user => {
                if (!user) {
                    return res.status(401).send({ message: "Wrong Username or Password" })  
                }
                // Found user. Check password
                user.comparePassword(password, (err, isMatch) => {
                    if (!isMatch) {
                        return res.status(401).send({ message: "Wrong Username or Password" }) 
                    }
                    // Password matches. Create token
                    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, { expiresIn: "60 days" });
                    // Set cookie and redirect to root
                    res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
                    res.redirect('/');
                })
            })
            .catch(err => {
                console.log(err)
            });
    })
};