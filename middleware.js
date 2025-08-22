module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to do that');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req , res , next) =>{
    if(req.session.redirectUrl){
        console.log(req.session.redirectUrl);
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
}