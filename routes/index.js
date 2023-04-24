const express = require('express');
const router = express.Router();
const template = require('../lib/template');
const auth = require('../lib/auth');
router.get('/', (request,response)=>{
        const title = "welcome";
        const description = "hello, nodejs";
        const list = template.list(request.list);
        const html = template.html(title,description+`
        <p><img src="/images/1.jpg" width="100px"></p>
        `, list,
            `<a href="/topic/create">create</a>`,
            auth.statusUI(request,response)    
            );
            response.writeHead(200);
            response.end(html);
});



module.exports = router;