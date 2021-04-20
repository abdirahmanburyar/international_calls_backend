const router = require('express').Router();
const { createUser, loginUser, isAuthenticated, getAllUsers, fetchUser } = require('../../controllers/sys-users');
const { validateSysUserCreation, validateSysUserLogin } = require('../../controllers/sys-users/validation');
const { check } = require('express-validator')
const { foundEmail} = require('../../controllers/sys-users/foundEmail')

router.get('/', getAllUsers)
router.post('/create-user', validateSysUserCreation, foundEmail, createUser)
router.post('/login-user', validateSysUserLogin, loginUser)
router.get('/is-authenticated', isAuthenticated)
router.post('/', fetchUser)

module.exports = router