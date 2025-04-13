const isLoggedIn = function (req, res, next){


    if(!req.session.userId){
        // console.log("tidak ada session");
        const error = 'please login first!'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}

const isAdmin = function (req, res, next){

    if(!req.session.userId && req.session.role !== 'admin'){
        // console.log("tidak ada session");
        const error = 'you dont have access!'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}



module.exports = {isLoggedIn, isAdmin}