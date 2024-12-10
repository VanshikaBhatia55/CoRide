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
exports.cancle = exports.paymentSuccess = exports.checkout = exports.publishableKey = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const __1 = require("..");
const publishableKey = (req, res) => {
    return res.status(200).json({
        success: true,
        PublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
};
exports.publishableKey = publishableKey;
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rideDetails } = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                email: rideDetails.useremail,
            },
        });
        const ride = yield prisma.ride.findFirst({
            where: {
                rideId: rideDetails.rideId,
            },
        });
        if (!req.body.paymentMode) {
            const Response = yield prisma.booking.create({
                data: {
                    bookingStatus: "pending",
                    paymentStatus: "Cash",
                    rideId: Number(ride === null || ride === void 0 ? void 0 : ride.rideId),
                    riderId: Number(user === null || user === void 0 ? void 0 : user.userId),
                    seatsRequired: Number(rideDetails.seatsRequired),
                    driverId: Number(rideDetails.driverId),
                },
            });
            return res.status(200).json({
                success: "true ",
                data: "Ride request added successfully",
                mode: "Cash",
            });
        }
        else {
            yield prisma.booking.create({
                data: {
                    bookingStatus: "unconfirmed",
                    paymentStatus: "Online",
                    rideId: Number(ride === null || ride === void 0 ? void 0 : ride.rideId),
                    riderId: Number(user === null || user === void 0 ? void 0 : user.userId),
                    seatsRequired: Number(rideDetails.seatsRequired),
                    driverId: Number(rideDetails.driverId)
                }
            });
            const session = yield __1.stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: `${rideDetails.origin}-${rideDetails.destination}`,
                                description: "Ride Booking",
                            },
                            unit_amount: rideDetails.amount * 100,
                        },
                        quantity: 1,
                    }
                ],
                billing_address_collection: "required",
                customer_email: rideDetails.useremail,
                mode: 'payment',
                success_url: "http://localhost:8000/api/v1/payments/paymentSuccess/?session_id={CHECKOUT_SESSION_ID}&ride_id={}",
                cancel_url: "http://localhost:8000/ap1/v1/payments/cancelPayment"
            });
            return res.status(200).json({
                success: true,
                url: session.url,
                orderId: session.client_reference_id
            });
        }
    }
    catch (e) {
        console.log(e.message);
        return res.status(500).json({
            success: false,
            error: e.message,
        });
    }
});
exports.checkout = checkout;
const paymentSuccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield __1.stripe.checkout.sessions.retrieve(req.query.session_id);
    const email = session.customer_email;
    const user = yield prisma.user.findFirst({
        where: {
            email: email || ""
        }
    });
    const currentBooking = yield prisma.booking.updateMany({
        where: {
            riderId: Number(user === null || user === void 0 ? void 0 : user.userId),
            paymentStatus: "Online",
            bookingStatus: "unconfirmed",
        },
        data: {
            bookingStatus: "pending",
            stripe_ref_id: session.id
        }
    });
    return res.redirect("http://localhost:5173/myRides");
});
exports.paymentSuccess = paymentSuccess;
const cancle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    return res.status(200).json({
        sucess: false,
    });
});
exports.cancle = cancle;
