"use strict";

const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");


router.get("/", ctrl.output.login);
router.get("/login", ctrl.output.login);
router.get("/signup", ctrl.output.signup);
router.get("/notice", ctrl.output.notice);
router.get("/usersetting", ctrl.output.usersetting);
router.get("/notice_list", ctrl.output.notice_list);
router.get("/notice_list/content", ctrl.output.notice_content);

router.get("/team_main", ctrl.output.team_main);
router.get("/team_write", ctrl.output.team_write);
router.get("/team_list/content",ctrl.output.team_content);

router.post("/login", ctrl.process.login);
router.post("/signup", ctrl.process.signup);
router.post("/team_write", ctrl.process.team_write);
router.post("/comment_write", ctrl.process.comment_write);


module.exports = router;