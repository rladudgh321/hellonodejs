const db = require('../lib/db');
module.exports = function (app){
    const passport = require('passport');
    const LocalStrategy= require('passport-local');

    // const authData = {
    //     email:"egoing777@gmail.com",
    //     password:"111111",
    //     nickname:"egoing"
    // }

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user,done)=>{
        console.log("serializeUser", user);
        done(null, user.id);
    });

    passport.deserializeUser((id,done)=>{
        const user = db.get('users').find({id:id}).value();
        console.log("deserializeUser", id, user);
        done(null,user);
    });

    passport.use(new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "pwd"
        },
        function(email, password, done) {
            const user = db.get('users').find({email:email, password: password}).value();
            console.log("LocalStrategy", email, password, user);
            if(user){
                return done(null, user, {message:"welcome"});
            } else{
                return done(null, false, {message:"incorrect email"});
            }
        }
    ));



  return passport;
}
