import express from "express";

const router = express.Router()

/* GET lands JSON. */
router.get("/",async function (req, res, next) {
    const db = await req.app.get("binance")("btc");
    const prices = await db.find().toArray();
    res.json(prices);
});

export { router as pricesRouter };