const router = require("express").Router();

const publicController = require("../controller/publicCon");
router.get("/", publicController.getMainPage);

module.exports = router;
