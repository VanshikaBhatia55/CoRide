"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
router.get("/pubKey", paymentController_1.publishableKey);
router.post("/checkout", paymentController_1.checkout);
router.get("/paymentSuccess", paymentController_1.paymentSuccess);
router.get("/cancelPayment", paymentController_1.cancle);
exports.default = router;
