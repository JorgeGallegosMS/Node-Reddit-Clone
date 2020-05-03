const Post = require('../models/post');
const User = require('../models/user')

module.exports = app => {
    app.get('/posts/index', (req, res) => {
        let currentUser = req.user

        console.log(req.cookies);


        Post.find({}).lean().populate('author')
            .then(posts => {
                res.render('posts-index', { posts, currentUser })
            })
            .catch(err => {
                console.log(err.message);
            })
    })

    app.get("/posts/:id", function(req, res) {
        let currentUser = req.user

        Post.findById(req.params.id).lean().populate({ path: 'comments', populate: { path: 'author' } }).populate('author')
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
            post.author = req.user._id;

            console.log(post.author)

            post.save()
                .then(post => {
                    return User.findById(req.user._id);
                })
                .then(user => {
                    user.posts.unshift(post);
                    user.save();
                    res.redirect(`/posts/${post._id}`);
                })
                .catch(err => {
                    console.log(err.message);
                });
        } else {
            return res.status(401) // Unauthorized
        }
        
    });

    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
        let currentUser = req.user

        Post.find({ subreddit: req.params.subreddit }).lean().populate('author')
        .then(posts => {
            res.render("posts-index", { posts, currentUser });
        })
        .catch(err => {
            console.log(err);
        });
    });
};