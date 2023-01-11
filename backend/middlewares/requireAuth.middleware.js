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
  if (req.body._id === '6390c87cf7234d1a94f4a891' || req.params.id === '6390c87cf7234d1a94f4a891' && !_isValidUser(loggedinUser._id)) return res.status(401).send('Not Authenticated')
  if (!loggedinUser) return res.status(401).send('Not Authenticated')
  req.loggedinUser = loggedinUser
  next()
}

function _isValidUser(loggedinUserId) {
  if (loggedinUserId === '6390def7f66d9762b2800e17' || loggedinUserId === '638f30e436d0392801708bd9' || loggedinUserId === '638f30e436d0392801708bd7') return true
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
