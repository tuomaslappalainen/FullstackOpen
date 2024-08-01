const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users')

usersRouter.post('/', async (req, res) => {
    const {username, name, password} = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
    }

    if(password.length < 3){
        return res.status(400).json({ error: 'password must be at least 3 characters'})
    }

    const existingUser = await User.findOne({username})
    if(existingUser){
        return res.status(400).json({ error: 'username must be unique'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const userSaved = await user.save()

    res.status(200).json(userSaved)
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1, likes: 1})

    res.json(users)
})

module.exports = usersRouter