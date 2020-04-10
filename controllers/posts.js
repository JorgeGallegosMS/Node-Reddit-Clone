const Post = require('../models/post');

module.exports = app => {
    app.get('/posts/index', (req, res) => {
        Post.find({}).lean()
            .then(posts => {
                res.render('posts-index', { posts })
            })
            .catch(err => {
                console.log(err.message);
            })
    })

    app.get("/posts/:id", function(req, res) {
        Post.findById(req.params.id).lean()
            .then(post => {
                res.render("posts-show", { post });
            })
            .catch(err => {
                console.log(err.message);
            });
        });

    // CREATE
    app.post("/posts/new", (req, res) => {
        const post = new Post(req.body);

        post.save((err, post) => {
            console.log(post);
            return res.redirect('/');
        })
    });
};