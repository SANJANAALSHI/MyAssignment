const express = require("express");
const app = express();
var httpsRedirect = require('express-https-redirect');
const path = require("path")
app.use(express.static("app"));
app.use('/', httpsRedirect());
app.get('*', function (req, res, next) {
    res.sendFile(path.resolve('app/index.html'));
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}`);
});
