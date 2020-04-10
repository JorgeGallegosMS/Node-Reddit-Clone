const Post = require('../models/post');

module.exports = app => {
    // CREATE
    app.post("/posts/new", (req, res) => {
        const post = new Post(req.body);

        post.save((err, post) => {
            console.log(post);
            return res.redirect('/');
        })
    });
};