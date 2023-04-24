const express = require('express');
const router = express.Router();
const fs = require('fs');
const template = require('../lib/template');
const path = require('path');
const sanitize = require('sanitize-html');
const auth = require('../lib/auth');

router.get('/login', (request,response)=>{
    console.log("request.list",request.list);
    const title = "Login";
    const list = template.list(request.list);
    const html = template.html(title,'',list,
    `<form action="/auth/login" method="post">
    <p><input type="text" name="email" placeholder="email"></p>
    <p><input type="password" name="pwd" placeholder="password"></p>
    <p><input type="submit" value="login"></p>
    </form>`,
    auth.statusUI(request,response)
    );
    response.send(html);
});

router.get('/logout', (request,response,next)=>{
    request.logout(err=>{
        if(err){
            return next(err);
        }
        response.redirect('/');
    });
});
        
        /*
router.post('/login', (request,response)=>{
    const post = request.body;
    const email = post.email;
    const password = post.pwd;
    if(email === "egoing777@gmail.com" && password === "111111"){
        request.session.is_logined = true;
        request.session.nickname = 'egoing';
        request.session.save(()=>{
            response.redirect('/');
        })
    } else {
        response.send('who?');
    }
});

router.get('/logout', (request,response)=>{
        request.session.destroy((err)=>{
            response.redirect('/');
        });
});

router.get('/create', (request,response)=>{
    console.log("request.list",request.list);
    const title = "CREATE";
            const list = template.list(request.list);
            const html = template.html(title,'',list,
            `<form action="/topic/create" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="create"></p>
            </form>`
            );
            response.writeHead(200);
            response.end(html);
        
    });

    router.post('/create', (request,response)=>{
            const post = request.body;
            const title = post.title;
            const description = post.description;
            fs.writeFile(`./data/${title}`,description,'utf-8',(error)=>{
                response.writeHead(302,{
                    Location:`/${title}`
                });
                response.end();
            });
    });

    router.get('/update/:pageId',(request,response)=>{
        
            const filteredid = path.parse(request.params.pageId).base;
            fs.readFile(`./data/${filteredid}`,'utf-8',(error,description)=>{
                const title = "UPDATE";
                const list = template.list(request.list);
                const html = template.html(title,'',list,
                `<form action="/topic/update" method="post">
                    <input type="hidden" name="id" value="${filteredid}">
                    <p><input type="text" name="title" placeholder="title" value="${filteredid}"></p>
                    <p><textarea name="description" placeholder="description">${description}</textarea></p>
                    <p><input type="submit" value="update"></p>
                </form>`
                );
                response.writeHead(200);
                response.end(html);
            });
       
    });

    router.post('/update', (request,response)=>{
        const post = request.body;  
        const id = post.id;
        const title = post.title;
        const description = post.description;
        fs.rename(`./data/${id}`,`./data/${title}`,result =>{
            fs.writeFile(`./data/${title}`,description,'utf-8',(error)=>{
                response.writeHead(302,{
                    Location:`/${title}`
                });
                response.end();
            });
        });
    });

    router.post('/delete', (request,response)=>{
        const post = request.body;
        const id = post.id;
        const filteredid = path.parse(id).base;
        fs.unlink(`./data/${filteredid}`,(result)=>{
            response.writeHead(302,{
                Location:`/`
            });
            response.end();
        });
    });

    router.get('/:pageId', (request,response)=>{
            // console.log("request.list",request.list);

        fs.readdir(`./data`,(error, filelist)=>{
            const filteredid = path.parse(request.params.pageId).base;
            console.log(filteredid);
            fs.readFile(`./data/${filteredid}`,'utf-8',(error,description)=>{
                const title = sanitize(filteredid);
                const list = template.list(filelist);
                const html = template.html(title,sanitize(description),list,
                `<a href="/topic/create">create</a>
                <a href="/topic/update/${filteredid}">update</a>
                <form action="/topic/delete" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="submit" value="delete"></p>
                </form>
                `  
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
*/
module.exports = router;