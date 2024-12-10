"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const userController_1 = require("../controllers/userController");
router.post("/signin", userController_1.signUp);
router.get("/getCars", userController_1.getCars);
router.post("/setCars", userController_1.setCars);
exports.default = router;
