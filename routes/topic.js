const express = require('express');
const router = express.Router();
const fs = require('fs');
const template = require('../lib/template');
const path = require('path');
const sanitize = require('sanitize-html');
const auth = require('../lib/auth');
const db = require('../lib/db');
const shortid = require('shortid');
router.get('/create', (request,response)=>{
    if(!auth.isOwner(request,response)){
        response.redirect('/');
        return false;
    }
    const title = "CREATE";
            const list = template.list(request.list);
            const html = template.html(title,'',list,
            `<form action="/topic/create" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="create"></p>
            </form>`, auth.statusUI(request,response)
            );
            response.writeHead(200);
            response.end(html);
        
    });

    router.post('/create', (request,response)=>{
        if(!auth.isOwner(request,response)){
            response.redirect('/');
            return false;
        }
            const post = request.body;
            const title = post.title;
            const description = post.description;
            const id=shortid.generate();
            db.get('topics').push({
                id:id,
                title:title,
                description:description,
                user_id:request.user.id
            }).write();
            response.redirect(`/topic/${id}`);
    });

    router.get('/update/:pageId',(request,response)=>{
        if(!auth.isOwner(request,response)){
            response.redirect('/');
            return false;
        }
        const topic = db.get('topics').find({id:request.params.pageId}).value();
        if(topic.user_id !== request.user.id){
            request.flash('error', 'Not yours');
            return response.redirect('/');
        }
                const title = "UPDATE";
                const list = template.list(request.list);
                const html = template.html(title,'',list,
                `<form action="/topic/update" method="post">
                    <input type="hidden" name="id" value="${topic.id}">
                    <p><input type="text" name="title" placeholder="title" value="${topic.title}"></p>
                    <p><textarea name="description" placeholder="description">${topic.description}</textarea></p>
                    <p><input type="submit" value="update"></p>
                </form>`, auth.statusUI(request,response)
                );
                response.writeHead(200);
                response.end(html);
     
       
    });

    router.post('/update', (request,response)=>{
        if(!auth.isOwner(request,response)){
            response.redirect('/');
            return false;
        }
        const post = request.body;  
        const id = post.id;
        const title = post.title;
        const description = post.description;
        if(topic.user_id !== request.user.id){
            request.flash('error', 'Not yours');
            return response.redirect('/');
        }
        db.get('topics').find({id:id}).assign({
            title:title,
            description:description
        }).write();
        response.redirect(`/topic/${id}`);
    });

    router.post('/delete', (request,response)=>{
        if(!auth.isOwner(request,response)){
            response.redirect('/');
            return false;
        }
        const post = request.body;
        const id = post.id;
        const topic = db.get('topics').find({id:id}).value();
        if(topic.user_id !== request.user.id){
            request.flash('error', 'Not yours');
            return response.redirect('/');
        }
        const filteredid = path.parse(id).base;
        db.get('topics').remove({id:filteredid}).write();
        response.redirect('/');
    });

    router.get('/:pageId', (request,response,next)=>{
        const topic = db.get('topics').find({id:request.params.pageId}).value();
        const user = db.get('users').find({id:topic.user_id}).value();
        console.log("topic",topic);
        const title = sanitize(topic.title);
        const list = template.list(request.list);
        const html = template.html(title,sanitize(topic.description),list,
        `<p>by ${user.displayName}</p>
        <a href="/topic/create">create</a>
        <a href="/topic/update/${topic.id}">update</a>
        <form action="/topic/delete" method="post">
        <input type="hidden" name="id" value="${topic.id}">
        <p><input type="submit" value="delete"></p>
        </form>
        `, auth.statusUI(request,response)
        );
        response.writeHead(200);
        response.end(html);
    });

module.exports = router;