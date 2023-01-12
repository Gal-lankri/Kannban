const authService = require('../api/auth/auth.service')
const logger = require('../services/logger.service')
const config = require('../config')

function requireAuth(req, res, next) {
  if (config.isGuestMode && !req?.cookies?.loginToken) {
    req.loggedinUser = {
      fullname: 'Dima Demo', email: 'dima-demo@mystartup.org', isAdmin: false, imgUrl: 'src/assets/img/user1.jpg'
    }
    //  {
    //      fullname: 'Dima Demo', email: 'dima-demo@mystartup.org', isAdmin: false, imgUrl: 'src/assets/img/user1.jpg'
    //   }
    return next()
  }
  if (!req?.cookies?.loginToken) return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  // Check if is the demo board
  if (!_isValidUser(loggedinUser._id) && (req.body._id === '6390c87cf7234d1a94f4a891' || req.params.id === '6390c87cf7234d1a94f4a891')) return res.status(401).send('Not Authenticated')
  if (!loggedinUser) return res.status(401).send('Not Authenticated')
  req.loggedinUser = loggedinUser
  next()
}

function _isValidUser(loggedinUserId) {
  if (loggedinUserId === '63c038773217b70d4886ada1' || loggedinUserId === '63c05175a6be1312b42550e0' || loggedinUserId === '63c05401a6be1312b42550e1') return true
  return false
}

function requireAdmin(req, res, next) {
  if (!req?.cookies?.loginToken) return res.status(401).send('Not Authenticated')
  const loggedinUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedinUser.isAdmin) {
    logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
    res.status(403).end('Not Authorized')
    return
  }
  next()
}


// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin
}
