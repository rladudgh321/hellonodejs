module.exports = {
    statusUI: function (request,response){
        let authStatusUI = `<a href="/auth/login">login<a>`;
        if(request.session.is_logined){
            authStatusUI = `<a href="/auth/logout">logout<a>`;
        }
        return authStatusUI;
    }
}