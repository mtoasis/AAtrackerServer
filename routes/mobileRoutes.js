const db = require("../models")

module.exports = app => {

app.get('/api/posts', (req, res)=>{

    console.log(`signal received`)
    db.Post
    .find(req.query)
    .then(dbModel => res.json(dbModel))
    .catch(err => res.status(422).json(err))    
})

app.post("/api/posts", function (req, res){
    console.log(req.body)
    db.Post
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
});

}