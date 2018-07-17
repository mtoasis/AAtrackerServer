const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const passport = require('passport');

const keys = require('./config/keys');
// require('./config/passport');

require('./models');

mongoose.Promise = Promise;
mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./routes/mobileRoutes')(app);

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT);

