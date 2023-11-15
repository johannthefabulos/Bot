import express from "express";

const router = express.Router()

/* GET lands JSON. */
router.get("/",async function (req, res, next) {
    const db = await req.app.get("binance")("times_btc");
    const times = await db.find().toArray();
    res.json(times);
});


export { router as timesRouter };