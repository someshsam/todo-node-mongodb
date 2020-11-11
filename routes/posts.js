const express = require('express');
const log = require('debug')('todo-node-mongo:server');
const router = express.Router();

const Posts = require('../models/Posts');

/* Get All Posts */
router.get('/', async (req, res) => {
    try {
        const allPosts = await Posts.find();
        res.status(200).json(allPosts);
    } catch (err) {
        log(err);
        res.status(404).json({ message: err })
    }
});

/* Create A Post */
router.post('/create', async (req, res) => {
    const posts = new Posts({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const createPost = await posts.save();
        res.status(200).json(createPost);
    } catch (err) {
        log(err);
        res.status(404).json({ message: err })
    }
});

/* Update A Post */
router.put('/update/:postId', async (req, res) => {
    try {
        const updatesPost = await Posts.findOneAndUpdate({ _id: req.params.postId }, { title: req.body.title }, { new: true });
        res.status(200).json(updatesPost);
    } catch (err) {
        log(err);
        res.status(404).json({ message: err })
    }
});

/* Delete A Post */
router.delete('/delete/:postId', async (req, res) => {
    try {
        const deletedPost = await Posts.findOneAndDelete({ _id: req.params.postId });
        res.status(200).json(deletedPost);
    } catch (err) {
        log(err);
        res.status(404).json({ message: err })
    }
});

/* Find One Post */
router.get('/getOnePost/:postId', async (req, res) => {
    try {
        const singlePost = await Posts.findOne({ _id: req.params.postId });
        res.status(200).json(singlePost);
    } catch (err) {
        log(err);
        res.status(404).json({ message: err })
    }
});


module.exports = router;