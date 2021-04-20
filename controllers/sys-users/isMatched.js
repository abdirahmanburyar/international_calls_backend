const { compare } = require('bcryptjs')
module.exports.comparedPassword = password => async (req, res) => {
    return await compare(req.body.password, password)
}