const BypassAuthFilter = (req, res, next) => {
    req.bypassAuth = true
    next()
}

module.exports = BypassAuthFilter