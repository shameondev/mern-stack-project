const {Router} = require('express')
const router = Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const config = require('config');

// /api/auth/register
router.post(
    '/register',
    [
      check('email', 'Wrong email').isEmail(),
      check('password', 'Password should be minimum 6 characters length')
          .isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect password'
            })
        }
        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: 'That user already exists.'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User ({ email, password: hashedPassword})

        await user.save()

        res.status(201).json({message: 'User has been created.'})

    } catch (e) {
        res.status(500).json({message: 'Something gone wrong. Try again.'})
    }
})

router.post(
    '/login',
    [
        check('email', 'Enter valid email').normalizeEmail().isEmail(),
        check('password', 'Enter a password').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect login data'
            })
        }
        const {email, password} = req.body

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: 'This user doesnt exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({message: 'Wrong password'})
        }

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )

        res.json({token, userId: user.id})



    } catch (e) {
        res.status(500).json({message: 'Something gone wrong. Try again.'})
    }
})

module.exports = router