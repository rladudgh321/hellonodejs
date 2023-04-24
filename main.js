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
app.use(compression());
app.use(body.urlencoded({extended:false}));

app.get('*', (request,response,next)=>{
    fs.readdir(`./data`,(error, filelist)=>{
        request.list = filelist;
        next();
    });
})

app.use(express.static('public'));

app.use(session({
    secret: 'hello',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
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
app.listen(3000);