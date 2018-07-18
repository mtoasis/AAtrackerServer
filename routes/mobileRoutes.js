const db = require("../models")

module.exports = app => {

    app.get('/api/posts', (req, res) => {

        console.log(`signal received`)
        db.Post
            .find(req.query)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    })

    app.post("/api/posts", function (req, res) {
        console.log(req.body)
        db.Post
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    });

    app.post("/api/findbyid", function (req, res) {
        console.log(req.body)

        const id = req.body.id

        db.Post
            .find({ userID: id })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    });

    app.get('/api/survey', (req, res) => {

        console.log(`signal received`)
        db.Survey
            .find(req.query).limit(1).sort({$natural:-1})
            // .find(req.query)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    })

    app.post("/api/survey", function (req, res) {
        console.log(req.body)
        db.Survey
          .create(req.body)
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err));
    });


}