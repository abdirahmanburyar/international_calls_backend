const db = require('../../database')

module.exports.foundEmail = async (req, res, next) => {
    try {
        return db.query('call checkUserExists(?)', 
          [req.body.email],
          async (err, row) => {
            if(err) return res.status(500).json("Server Err")
            let r = row[0][0].emailFound
            if(r !== 0) return res.status(302).json({ msg: "User already in Use"})
            next()
          }
        )
    } catch (err) {
        return res.status(500).json(err.message)
    }
}