const aboutController = {
    about(req, res, _next) {
        if (!req.session.user) {
            return res.redirect("/");
        }

        res.render('about', { title: "About" });
    }
};

export default aboutController;