import express from "express";

import { characterRouter } from "./character.js"

const router = express.Router();

characterRouter.mergeParams = true;

router.use("/:land_id/characters", characterRouter);

/* GET lands JSON. */
router.get("/",async function (req, res, next) {
    const db = await req.app.get("db")("lands");
    const lands = await db.find().toArray();
    res.json(lands);
});

/* GET specific land by ID */
router.get("/:land_id", async function(req,res,next){
    const db = await req.app.get("db")("lands");
    const landID = req.params.land_id;
    const target = await db.findOne({_id: Number(landID)});

    res.json(target);
});

router.post("/", async function(req,res,next){
    const db = await req.app.get("db")("lands");
    let newLand = req.body;
    try{
       await db.insertOne(newLand);
       res.status(201).json(newLand);
    } catch(e){
        console.log(e);
    }
});

router.put("/:land_id", async function (req,res,next){
    const db = await req.app.get("db")("lands");
    const replacedLand = req.body;
    await db.replaceOne(
        {
            _id: Number(req.params.land_id)
        },
        {
            ...replacedLand
        }
    );

    res.json(replacedLand)
});

router.delete("/:land_id", async function(req,res,next){
    const db = await req.app.get("db")("lands");
    await db.deleteOne({ _id: Number(req.params.land_id)});
    res.sendStatus(200);
});


// router.get("/:store_id/items", async function(req,res,next){
//     const itemsDB = await req.app.get("db")("items");
//     const storesDB = await req.app.get("db")("stores");

//     // const targetStore = await storesDB.findOne({ _id: Number(req.params.store_id)});
//     const items = await itemsDB.find({ store_id: Number(req.params.store_id)}).toArray();

//     res.json(items)
// });


// router.get("/:store_id/items/:item_id", async function(req,res,next){
//     const itemsDB = await req.app.get("db")("items");
//     const storesDB = await req.app.get("db")("stores");

//     // const targetStore = await storesDB.findOne({ _id: Number(req.params.store_id)});
//     const foundItem = await itemsDB.findOne({ _id: Number(req.params.item_id)});

//     res.json(foundItem)
// });

// router.patch("/:store_id", async function(req,res,next){
//     const db = await req.app.get("db")("stores");
//     await db.updateOne({
//         _id: Number(req.params.store_id)
//     },
//     {
//         $set: req.body
//     });
//     const updatedStore = await db.findOne({_id: Number(req.params.store_id)});

//     res.status(200).json(updatedStore)
// });

export { router as landRouter };