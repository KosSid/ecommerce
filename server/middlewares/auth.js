const admin = require('../firebase');
const User = require('../models/user') // access to User DB

exports.authCheck = async (req, res, next) => {
    // console.log(req.headers); // token

    try {
        //verify the tocken
        const firebaseUser = await admin
            .auth()
            .verifyIdToken(req.headers.authtoken)
        // console.log('FIREBASE USER IN AUTHCHECK', firebaseUser);

        // we get response and put it in req.user
        req.user = firebaseUser;
        next(); // next means that function after middleware will be executed
    } catch (err) {
        res.status(401).json({
            err: 'Invalid or expired token',
        })
    }
}

exports.adminCheck = async (req, res, next) => {
    const {email} = req.user // we have access to req.user because it's a middelware and we have it from previous middelware

    const adminUser = await User.findOne({email: email}).exec();

    if (adminUser.role !== 'admin') {
        res
            .status(403)
            .json({
                err:'Admin resource. Access denied'
            })
    } else {
        next()
    }
}