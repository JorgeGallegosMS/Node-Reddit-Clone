const Post = require('../models/post');

module.exports = app => {
    app.get('/posts/index', (req, res) => {
        let currentUser = req.user

        Post.find({}).lean()
            .then(posts => {
                res.render('posts-index', { posts, currentUser })
            })
            .catch(err => {
                console.log(err.message);
            })
    })

    app.get("/posts/:id", function(req, res) {
        let currentUser = req.user

        Post.findById(req.params.id).lean().populate('comments')
            .then(post => {
                res.render("posts-show", { post, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            });
        });

    // CREATE
    app.post("/posts/new", (req, res) => {
        if (req.user) {
            let post = new Post(req.body);

            post.save((err, post) => {
                console.log(post);
                return res.redirect('/');
            })
        } else {
            return res.status(401) // Unauthorized
        }
        
    });

    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
        let currentUser = req.user

        Post.find({ subreddit: req.params.subreddit }).lean()
        .then(posts => {
            res.render("posts-index", { posts, currentUser });
        })
        .catch(err => {
            console.log(err);
        });
    });
};