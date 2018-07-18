var db = require("../models");


module.exports = function (app) {


  app.get("/api/ids/:id", function (req, res) {

    var id = req.params.id;

    db.lists.findAll({
      where: {
        id: id
      }
    }).then(function (data) {
      res.json(data);
    })
  })

  app.post("/api/check/post", function (req, res) {
    var name = req.body.name;
    var pin = req.body.pin;

    db.lists.findAll({
      where: {
        name: name,
        pin: pin
      }
    }).then(function (data) {
      if (data.length != 0) {
        db.users.findAll({
          where: {
            postId: data[0].id
          }
        }).then(function (response) {
          res.json(response)
        })
      }
      else {
        res.json(data)
      }
    })


  })

  app.post("/api/check/join", function (req, res) {
    var name = req.body.name;
    var pin = req.body.pin;
    // console.log(req.body)

    db.users.findAll({
      where: {
        name: name,
        pin: pin
      }
    }).then(function (data) {
      res.json(data)
    })
  })

  // app.get("/api/check/ride/:id", function(req, res){
  //   var school = req.params.school;
  // })


  app.get("/api/all/:school?", function (req, res) {

    var school = req.params.school;

    if (school) {
      console.log(`search for ${school}`)
      db.lists.findAll({
        where: {
          destination: school
        }
      }).then(function (data) {
        res.json(data);
      })
    }
    else if (school == null) {
      console.log(`print all`)
      db.lists.findAll({})
        .then(function (data) {
          for (var i = 0, n = data.length; i < n; i++) {
            if (!data[i].isFull) {
              if (data[i].currentSeats >= data[i].seats) {
                db.lists.update({
                  isFull: true
                },
                  {
                    where: {
                      id: data[i].id
                    }
                  })
              }
            }
          }
          res.json(data);
        });
    }

  });

  app.get("/user/:id", function (req, res) {
    var postId = req.params.id;
    db.users.findAll({
      where: {
        postid: postId
      }
    }).then(function (data) {
      res.json(data)
    })
  })


  app.get("/pin/:id", function (req, res) {
    var postId = req.params.id;

    db.lists.findAll({
      where: {
        id: postId
      }
    }).then(function (data) {
      res.json(data)
    })

  })


  app.post("/api/postRide", function (req, res) {
    db.lists.create(req.body)
      .then(function (data) {
        res.json(data)
      })

  })

  app.post("/api/joinRide", function (req, res) {
    console.log(req.body)
    db.users.create(req.body)
      .then(function (data) {
        res.json(data)
      })

  })

  app.put("/api/update", function (req, res) {
    console.log(req.body)
    db.lists.findAll({
      where: {
        id: req.body.id
      }
    }).then(function (data) {
      if (data[0].seats >= req.body.currentSeats) {
        console.log(`since max seat:${data[0].seats} >= current seat:${req.body.currentSeats}, seat is added`)
        db.lists.update({
          currentSeats: req.body.currentSeats
        }, {
            where: {
              id: req.body.id
            }
          })

        res.json({ success: true });
      }
      else {
        console.log(`${data[0].name} is currently full`)
        res.json({ success: false });
      }
    })

  });


};
