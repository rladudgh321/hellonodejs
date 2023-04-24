const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template');
const path = require('path');
const express = require('express');
const compression = require('compression');
const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');
const authRouter = require('./routes/auth');
const app = express();
const body = require('body-parser');
const cookie = require('cookie');
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
app.use(compression());
app.use(body.urlencoded({extended:false}));

app.get('*', (request,response,next)=>{
    fs.readdir(`./data`,(error, filelist)=>{
        request.list = filelist;
        next();
    });
})

app.use(express.static('public'));

const authData = {
    email:"egoing777@gmail.com",
    password:"111111",
    nickname:"egoing"
}

app.use(session({
    secret: 'hello',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done)=>{
    console.log("serializeUser", user);
    done(null, user.email);
});

passport.deserializeUser((id,done)=>{
    console.log("deserializeUser", id);
    done(null,authData);
});

passport.use(new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "pwd"
    },
    function(email, password, done) {
        console.log("LocalStrategy", email, password);
        if(email === authData.email){
            if(password === authData.password){
                return done(null, authData, {message:"welcome"});
            } else {
                return done(null, false, {message:"incorrect password"})
            }
        } else {
            return done(null, false, {message:"incorrect email"});
        }
    }
  ));


app.post('/auth/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }));

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth',authRouter);

    
    
    /*
    const app = http.createServer((request,response)=>{
        const queryData = url.parse(request.url,true).query;
        console.log(url.parse(request.url,true));
        const pathname = url.parse(request.url,true).pathname;
        
        
        if(pathname == '/'){
            if(queryData.id === undefined){
                
            } else {
                
        }
    } else if(pathname === '/create'){
        
    } else if(pathname === '/create_process'){
        
    } else if(pathname === '/update'){
        
    } else if(pathname === '/update_process'){
        
    } else if(pathname === '/delete_process'){
        
    } else {
        response.writeHead(404);
        response.end("not found");
    }
});
*/

app.use((request,response,next)=>{
    response.status(404).send('not found');
});

app.use((err,request,response,next)=>{
    console.error(err.stack);
    response.status(500).send('server error');
});

app.listen(3000);