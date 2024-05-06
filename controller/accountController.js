const accountController = {
    account(req, res, _next) {
        if (!req.session.user) {
            return res.redirect("/");
        }

        const user = req.session.user;
        
        res.render('account', { title: "Account", user });
    }

};

export default accountController;