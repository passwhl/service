let express = require('express');
let router = express.Router();

router.all('/', async function(req, res, next) {
    res.send('test')
});




module.exports = router;
