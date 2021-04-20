const { HASH_SALT = 12 } = process.env
const db = require('../../database')
const { validationResult } = require('express-validator')
const { hash } = require('bcryptjs')
const { comparedPassword } = require('./isMatched')
const { isEmpty } = require('lodash')
module.exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(errors.errors)
    }

    req.body.password = await hash(req.body.password, HASH_SALT)
    return await db.query('call registerUser(?, ?, ?, ?, ?, ?)', 
        [
            req.body.fullName,
            req.body.phone,
            req.body.role,
            req.body.status,
            req.body.password,
            req.body.email
        ],
        async (err, row, fields) => {
            if(err) return res.status(500).json({ msg: 'Server Err'})
            const r = row.affectedRows
            if(r === 1) return res.status(200).json({ msg: 'User has been created'})
        }
      
    )
  } catch (err) {
      return res.status(500).json(err.message)
  }
}

// get All users
module.exports.getAllUsers = async (req, res) => {
   try {
       return await db.query('call getAllUsers()',
       (err, rows) => {
           if(err) return res.status(500).json(err)
           if(isEmpty(rows[0])) return res.status(404).json({ msg: "No user found"})
           return res.status(200).json(rows[0].map(r => ({ ...r, password: undefined})))
       })
   } catch (err) {
    return res.status(500).json(err.message)
   }
}


// check user is authenticated
module.exports.isAuthenticated = (req, res) => {
    if(!req.session || !req.session.user) return res.status(401).json({ logged: false })
    return res.status(200).json(req.session.user)
}

module.exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json(errors.errors.reduce((obj, item) => {
                obj[item.param] = item.msg;
                return obj
            }, {}))
        }
        return await db.query('call loginUser(?)', 
        [
            req.body.email
        ],
        async (err, row, fields) => {
            if(err) return res.status(500).json({ msg: 'Server Err'})
            const user = row[0][0];
            const isMatched = await comparedPassword(user.password)(req, res)
            if(!isMatched) return res.status(400).json({msg : 'invalid credentials'})
            req.session.user = { ...user, password: undefined}
            return res.status(200).json({ msg: 'Logged in', user: { ...user, password: undefined}})
        }
    )
    } catch (err) {
        return res.status(500).json(err.message)
    }
}

// fetch one user by email
module.exports.fetchUser = async (req, res) => {
    try {
        console.log(req.body)
        if(!req.body || !req.body.email) return res.status(404).json({ msg: 'invalid params'})
        return await db.query('call getAUser(?)', 
        [
            req.body.email
        ],
        async (err, row, fields) => {
            if(err) return res.status(500).json({ msg: 'Server Err'})
            const user = row[0][0];
            return res.status(200).json({ user: { ...user, password: undefined}})
        }
    )
    } catch (err) {
        return res.status(500).json(err.message)
    }
}
