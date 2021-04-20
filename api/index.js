const userRoute = require('../routes/sys-users')

module.exports = app => {
    // system user
    app.use('/api/user', userRoute)
}