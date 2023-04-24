const fs = require('fs');
module.exports = {
    html : function (title, description, list, control, authStatusUI=`<a href="/auth/login">login<a>`) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="icon" href="data:,">
            <title>${title}</title>
        </head>
        <body>
            ${authStatusUI} 
            <h1><a href="/">web</a></h1>
            <ol>
                ${list}
            </ol>
            <h2>${title}</h2>
            <p>${description}</p>
            ${control}
        </body>
        </html>`;
    },
    list : function(filelist){
        let list = '';
        for(let i=0;i<filelist.length;i++){
            list += `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`;
        }
        return list;
    }
}