"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCars = exports.getCars = exports.signUp = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nickname, name, picture, email } = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!user) {
            yield prisma.user.create({
                data: {
                    email: email,
                    fullName: nickname,
                    userName: name + Math.random() * 6,
                    profile_picture: picture,
                },
            });
            return res.status(200).json({
                success: true,
                message: "User Created",
            });
        }
        else {
            return res.status(200).json({
                success: false,
                message: "User already exists",
            });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "User and DB sync error",
            error: e.message,
        });
    }
});
exports.signUp = signUp;
const getCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const user = yield prisma.user.findFirst({
            where: {
                email
            },
            select: {
                userId: true
            }
        });
        console.log(user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        else {
            const cars = yield prisma.vehicle.findMany({
                where: {
                    vehicleOwnerUserId: user.userId
                }
            });
            if (!cars) {
                return res.status(404).json({
                    success: false,
                    message: "No cars not found"
                });
            }
            else {
                return res.status(200).json({
                    success: true,
                    cars
                });
            }
        }
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: "User and DB sync error",
            error: e.message,
        });
    }
});
exports.getCars = getCars;
const setCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body.user;
        const { company, model, type, purchaseYear, capacity } = req.body.values;
        const u = yield prisma.user.findFirst({
            where: {
                email
            },
            select: {
                userId: true
            }
        });
        if (!u) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const newVehicle = yield prisma.vehicle.create({
            data: {
                Company: company,
                model,
                vehicleType: type,
                purchaseYear: +purchaseYear,
                capacity: +capacity,
                vehicleOwner: {
                    connect: {
                        userId: u.userId
                    }
                }
            }
        });
        return res.status(200).json({
            message: "Vehicle added successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error
        });
    }
});
exports.setCars = setCars;
