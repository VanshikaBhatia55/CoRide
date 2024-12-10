"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const stripe_1 = __importDefault(require("stripe"));
const cors_1 = __importDefault(require("cors"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const rides_1 = __importDefault(require("./routes/rides"));
const payments_1 = __importDefault(require("./routes/payments"));
const app = (0, express_1.default)();
(0, dotenv_1.config)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
app.use("/api/v1/auth", authRoute_1.default);
app.use("/api/v1/rides", rides_1.default);
app.use("/api/v1/payments", payments_1.default);
app.listen(process.env.PORT || 3000).on("error", (e) => {
    console.log("Error in listening to port", e);
});
