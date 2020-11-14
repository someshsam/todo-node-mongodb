const express = require('express');
const { mongoose } = require('mongoose');
const log = require('debug')('todo-node-mongo:server');
const router = express.Router();

const Posts = require('../models/Posts');

/* Get All Posts */
router.get('/', async (req, res) => {
    try {
        const allPosts = await Posts.find({});
        res.status(200).json(allPosts.length ? allPosts[0]?.posts : allPosts);
    } catch (err) {
        log(err);
        res.status(404).json({ message: err })
    }
});

/* Create A Post */
router.post('/create', async (req, res) => {
    const isExist = await Posts.findOne({ userId: req.user.id });
    let createPost;
    try {
        if (!isExist) {
            const posts = new Posts({
                userId: req.user.id,
                posts: {
                    title: req.body.title,
                    description: req.body.description
                }
            });
            createPost = await posts.save();
        } else {
            createPost = await Posts.updateOne(
                { userId: req.user.id },
                {
                    $push: {
                        posts: [
                            { title: req.body.title, description: req.body.description }
                        ]
                    }
                },
                { new: true }
            )
        }

        res.status(201).json(createPost);
    } catch (err) {
        log(err);
        res.status(404).json({ message: err })
    }
});

/* Update A Post */
router.put('/update/:postId', async (req, res) => {
    try {
        const updatesPost = await Posts.findOneAndUpdate(
            { userId: req.user.id, "posts._id": req.params.postId },
            {
                $set: {
                    "posts.$.title": req.body.title,
                    "posts.$.description": req.body.description
                }
            },
            { new: true }
        );
        res.status(202).json(updatesPost);
    } catch (err) {
        log(err);
        res.status(404).json({ message: err })
    }
});

/* Delete A Post */
router.delete('/delete/:postId', async (req, res) => {
    try {
        const deletedPost = await Posts.findOneAndUpdate(
            { userId: req.user.id },
            {
                $pull: { "posts": { _id: req.params.postId } }
            },
            { new: true }
        );
        res.status(200).json(deletedPost);
    } catch (err) {
        log(err);
        res.status(404).json({ message: err })
    }
});

/* Find One Post */
router.get('/getOnePost/:postId', async (req, res) => {
    try {
        const singlePost = await Posts
            .findOne({ userId: req.user.id })
            .select({ posts: { $elemMatch: { _id: req.params.postId } } })
        res.status(200).json(singlePost?.posts?.length ? singlePost?.posts[0] : {});
    } catch (err) {
        log(err);
        res.status(404).json({ message: err })
    }
});


module.exports = router;