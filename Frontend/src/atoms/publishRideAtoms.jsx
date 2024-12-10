import { atom } from "recoil";

new Date()
export const publishSourceAtom = atom({
    key: "sourceAtom",
    default: ""
});

export const publishDestAtom = atom({
    key: "destAtom",
    default: ""
});

export const startTimeAtom = atom({
    key: "startTimeAtom",
    default: ""
});

export const etaAtom = atom({
    key: "etaAtom",
    default: ""
});

export const publishDateAtom = atom({
    key: "publishDateAtom",
    default: new Date()
});

export const seatsAtom = atom({
    key: "seatsAtom",
    default: 1
});
export const vehicleAtom = atom({
    key: "vehicleAtom",
    default: ""
});
export const priceAtom = atom({
    key: "priceAtom",
    default: 0
});