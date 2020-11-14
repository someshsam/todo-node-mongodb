const express = require('express');
const log = require('debug')('todo-node-mongo:server');
const bcrypt = require('bcrypt');

const generateToken = require('../helpers/generateToken');
const Auth = require('../models/Auth');

const router = express.Router();
console.log('')
/* Signin Router */
router.post('/signin', async (req, res) => {
    try {
        const userData = await Auth.findOne({ email: req.body.email });
        if (!userData || req.body.email !== userData.email || !bcrypt.compareSync(req.body.password, userData.password)) {
            res.status(404).json({ message: 'Email or Password does not match' });
        } else {
            const { _id, email, password } = userData;
            await generateToken(res, _id, email);
            res.status(200).json({ id: _id, email })
        }
    } catch (error) {
        res.status(404).json({ message: error });
        log(error);
    }
});

/* Signup Router */
router.post('/signup', async (req, res) => {
    const isUserExist = await Auth.findOne({ email: req.body.email});
    if (isUserExist) {
        return res.status(401).json({message: `User already exist with email id ${req.body.email}`})
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
    const auth = new Auth({
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const userData = await auth.save();
        res.status(200).json(userData);
    } catch (error) {
        res.status(404).json({ message: error });
        log(error);
    }
});

/* Logout Router */
router.get('/logout', (req, res) => {
    res.clearCookie("token", { path: "/" });
    res.status(200).json({message: 'Logout successfully'})
});

module.exports = router