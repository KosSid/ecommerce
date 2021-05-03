const User = require('../models/user')


exports.createOrUpdateUser = async (req, res) => {
    // res.json({
    //     data: 'hey you hit create-or-update-user API endpoint'
    // });

    // We create user based on data we got from FRONTEND
    const {name, picture, email} = req.user;
    // We create it based on email
    const user = await User.findOneAndUpdate(
        {email: email},
        {name: email.split('@')[0], picture: picture},
        {new: true}
        );
    if (user) {
        console.log('USER UPDATED ------------------>', user);
        res.json(user);
    } else {
        const newUser = await new User({
            email,
            name: email.split('@')[0],
            picture
        }).save();
        console.log('USER CREATED ----------------->', newUser);
        res.json(newUser);
    }
}

exports.currentUser = async (req, res) => {
    // filter user using email from data base. email = req.user.email. We got it from authCheck middleware in routes auth
    User.findOne({email: req.user.email}).exec((err, user) => {
        if(err) throw new Error(err);
        // we got user from the response
        res.json(user);
    })
}