const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const template = require('./lib/template');
const path = require('path');
const sanitize = require('sanitize-html');

const app = http.createServer((request,response)=>{
    const queryData = url.parse(request.url,true).query;
    console.log(url.parse(request.url,true));
    const pathname = url.parse(request.url,true).pathname;
    

    if(pathname == '/'){
        if(queryData.id === undefined){
            fs.readdir(`./data`,(error, filelist)=>{
                const title = "welcome";
                const description = "hello, nodejs";
                const list = template.list(filelist);
                const html = template.html(title,description, list,
                `<a href="/create">create</a>`    
                );
                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir(`./data`,(error, filelist)=>{
                const filteredid = path.parse(queryData.id).base;
                fs.readFile(`./data/${filteredid}`,'utf-8',(error,description)=>{
                    const title = sanitize(filteredid);
                    const list = template.list(filelist);
                    const html = template.html(title,sanitize(),list,
                    `<a href="/create">create</a>
                    <a href="/update?id=${filteredid}">update</a>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="submit" value="delete"></p>
                    </form>
                    `  
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if(pathname === '/create'){
        fs.readdir(`./data`,(error, filelist)=>{
            const title = "CREATE";
            const list = template.list(filelist);
            const html = template.html(title,'',list,
            `<form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="create"></p>
            </form>`
            );
            response.writeHead(200);
            response.end(html);
        });
    } else if(pathname === '/create_process'){
        let body ='';
        request.on('data', data=>{
            body += data; 
        });
        request.on('end', ()=>{
            const post = qs.parse(body);
            const title = post.title;
            const description = post.description;
            fs.writeFile(`./data/${title}`,description,'utf-8',(error)=>{
                response.writeHead(302,{
                    Location:`/?id=${title}`
                });
                response.end();
            });
        });
    } else if(pathname === '/update'){
        fs.readdir(`./data`,(error, filelist)=>{
            const filteredid = path.parse(queryData.id).base;
            fs.readFile(`./data/${filteredid}`,'utf-8',(error,description)=>{
                const title = "UPDATE";
                const list = template.list(filelist);
                const html = template.html(title,'',list,
                `<form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <p><input type="text" name="title" placeholder="title" value="${queryData.id}"></p>
                    <p><textarea name="description" placeholder="description">${description}</textarea></p>
                    <p><input type="submit" value="update"></p>
                </form>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if(pathname === '/update_process'){
        let body ='';
        request.on('data', data=>{
            body += data; 
        });
        request.on('end', ()=>{
            const post = qs.parse(body);
            const id = post.id;
            const title = post.title;
            const description = post.description;
            fs.rename(`./data/${id}`,`./data/${title}`,result =>{
                fs.writeFile(`./data/${title}`,description,'utf-8',(error)=>{
                    response.writeHead(302,{
                        Location:`/?id=${title}`
                    });
                    response.end();
                });
            });
        });
    } else if(pathname === '/delete_process'){
        let body ='';
        request.on('data', data=>{
            body += data; 
        });
        request.on('end', ()=>{
            const post = qs.parse(body);
            const id = post.id;
            const filteredid = path.parse(id).base;
            fs.unlink(`./data/${filteredid}`,(result)=>{
                response.writeHead(302,{
                    Location:`/`
                });
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end("not found");
    }
});

app.listen(3000);