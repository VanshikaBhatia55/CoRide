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
exports.markCompleted = exports.fetchUpcomingRides = exports.acceptPassenger = exports.declinePassenger = exports.fetchRequets = exports.fetchRides = exports.createRide = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { source, destination, departureTime, ETA, date, seatsRemaining, vehicle, fare } = req.body.values;
        const { company, model } = vehicle.split('-');
        const user = yield prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
        });
        const vId = yield prisma.vehicle.findFirst({
            where: {
                Company: company,
                model
            }
        });
        if (!user) {
            throw new Error("User not found");
        }
        const rideCreation = yield prisma.ride.create({
            data: {
                driver: {
                    connect: {
                        userId: user.userId
                    }
                },
                vehicle: {
                    connect: {
                        vehicleId: vId === null || vId === void 0 ? void 0 : vId.vehicleId
                    }
                },
                origin: source,
                price: parseFloat(fare),
                destination,
                departureTime: `${date.split("T")[0]}T${departureTime}:00Z`,
                EstimatedArrivalTime: `${date.split("T")[0]}T${ETA}:00Z`,
                seatsRemaining
            }
        });
        return res.status(200).json({
            message: "Ride created successfully"
        });
    }
    catch (e) {
        console.log("error");
        console.error(e);
        res.status(500).json({
            message: e
        });
    }
});
exports.createRide = createRide;
const fetchRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { SC, DC, date, seats } = req.query;
        if (!date || !SC || !DC || !seats) {
            return res.status(200).json({
                success: false,
                error: "Please provide all the trip details",
            });
        }
        const rides = yield prisma.ride.findMany({
            where: {
                origin: { contains: SC ? SC.toString() : undefined },
                destination: { contains: DC ? DC.toString() : undefined },
            }
        });
        const filteredRides = rides.filter(ride => {
            const tofilterDate = new Date(date.toString());
            return (tofilterDate.toISOString().split('T')[0] === ride.departureTime.toISOString().split('T')[0]
                &&
                    seats <= ride.seatsRemaining.toString());
        });
        return res.status(200).json({
            success: true,
            mesaage: "Rides fetched Successfully",
            rides: filteredRides,
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error in finding rides",
            error: e.mesaage
        });
    }
});
exports.fetchRides = fetchRides;
const fetchRequets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        const user = yield prisma.user.findFirst({
            where: {
                email: email,
            }
        });
        const passengerRequests = yield prisma.booking.findMany({
            where: {
                driverId: user === null || user === void 0 ? void 0 : user.userId
            },
            select: {
                paymentStatus: true,
                bookingStatus: true,
                ride: {
                    select: {
                        origin: true,
                        destination: true,
                        departureTime: true,
                        EstimatedArrivalTime: true,
                        seatsRemaining: true,
                        price: true,
                        rideId: true
                    }
                },
                seatsRequired: true,
                rider: true,
                bookingId: true
            }
        });
        const filteredPassengers = passengerRequests.filter(passengerRequest => { var _a; return passengerRequest.bookingStatus === 'pending' && ((_a = passengerRequest.ride) === null || _a === void 0 ? void 0 : _a.seatsRemaining) || 0 >= passengerRequest.seatsRequired; });
        return res.status(200).json({
            success: true,
            requestedPassengers: filteredPassengers
        });
    }
    catch (e) {
        return res.status(500).json({
            success: "false",
            error: e.message
        });
    }
});
exports.fetchRequets = fetchRequets;
const declinePassenger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentReq } = req.body;
        const data = yield prisma.booking.update({
            where: {
                bookingId: currentReq.bookingId,
            },
            data: {
                bookingStatus: "declined",
            }
        });
        if (data.paymentStatus === "Online") {
        }
        else {
            return res.status(200).json({
                success: true,
            });
        }
    }
    catch (e) {
        return res.status(500).json({
            success: false,
        });
    }
});
exports.declinePassenger = declinePassenger;
const acceptPassenger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentReq } = req.body;
        if (!currentReq || !currentReq.bookingId || !currentReq.ride || !currentReq.rider) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request payload',
            });
        }
        const updatedBooking = yield prisma.booking.update({
            where: {
                bookingId: currentReq.bookingId,
            },
            data: {
                bookingStatus: 'accepted',
            },
        });
        const updatedRide = yield prisma.ride.update({
            where: {
                rideId: currentReq.ride.rideId,
            },
            data: {
                Passengers: {
                    connect: {
                        userId: currentReq.rider.userId,
                    },
                },
                seatsRemaining: {
                    decrement: Number(currentReq.seatsRequired)
                }
            },
        });
        res.status(200).json({
            success: true,
            data: {
                updatedBooking,
                updatedRide,
            },
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'An error occurred while accepting the passenger',
        });
    }
});
exports.acceptPassenger = acceptPassenger;
const fetchUpcomingRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        const user = yield prisma.user.findFirst({
            where: {
                email: email,
            }
        });
        const passengerRequests = yield prisma.booking.findMany({
            where: {
                OR: [
                    { driverId: user === null || user === void 0 ? void 0 : user.userId, },
                    {
                        riderId: user === null || user === void 0 ? void 0 : user.userId
                    }
                ]
            },
            select: {
                paymentStatus: true,
                bookingStatus: true,
                ride: {
                    select: {
                        origin: true,
                        destination: true,
                        departureTime: true,
                        EstimatedArrivalTime: true,
                        seatsRemaining: true,
                        price: true,
                        rideId: true,
                        completed: true
                    }
                },
                seatsRequired: true,
                rider: true,
                bookingId: true
            }
        });
        const filteredPassengers = passengerRequests.filter(passengerRequest => { var _a; return passengerRequest.bookingStatus === 'accepted' && ((_a = passengerRequest.ride) === null || _a === void 0 ? void 0 : _a.completed) === false; });
        return res.status(200).json({
            success: true,
            AcceptedPassengers: filteredPassengers
        });
    }
    catch (e) {
        return res.status(500).json({
            success: "false",
            error: e.message
        });
    }
});
exports.fetchUpcomingRides = fetchUpcomingRides;
const markCompleted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { curr } = req.body;
        const data = yield prisma.ride.update({
            where: {
                rideId: curr.ride.rideId
            },
            data: {
                completed: true,
            }
        });
        return res.status(200);
    }
    catch (e) {
    }
});
exports.markCompleted = markCompleted;
