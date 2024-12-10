import { atom } from "recoil";

export const searchSourceAtom = atom({
    key: "searchSourceAtom",
    default: ""
});

export const searchDestAtom = atom({
    key: "searchDestAtom",
    default: ""
});

export const searchDateAtom = atom({
    key: "searchDateAtom",
    default: new Date()
});

export const searchSeatsAtom = atom({
    key: "searchSeatsAtom",
    default: 1
});
