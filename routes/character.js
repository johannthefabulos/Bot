import express from "express";

const router = express.Router();

router.get("/",async function (req, res, next) {
    const characterDB = await req.app.get("db")("characters");
    const landsDB = await req.app.get("db")("lands");

    const targetLand = await landsDB.findOne({ _id: Number(req.params.land_id)});
    const characters = await characterDB.find({ land_id: Number(req.params.land_id)}).toArray();

    res.json({...targetLand, characters: [...characters]})

});

/* GET specific item by ID */
router.get("/:character_id", async function(req,res,next){
    const charactersDB = await req.app.get("db")("characters");
    const landsDB = await req.app.get("db")("lands");

    const targetLand = await landsDB.findOne({ _id: Number(req.params.land_id)});
    const characters = await charactersDB.find({ land_id: Number(req.params.land_id)}).toArray();
    const index = characters.findIndex(element => {
    if (element._id == req.params.character_id){
      return true;
    }
    return false;
    });
   const character = characters[index]

    res.json(character)

    // const db = await req.app.get("db")("items");
    // const itemID = req.params.item_id;
    // const target = await db.findOne({_id: Number(itemID)});

    // res.json(target);
});

/* POST an item */
router.post("/", async function(req,res,next){
    // const itemsDB = await req.app.get("db")("items");

    // const newItem = req.body;
    // console.log('hello')
    // itemsDB.insertOne(newItem)

    const db = await req.app.get("db")("characters");
    let newCharacter = req.body;
    try{
       await db.insertOne(newCharacter);
       res.status(201).json(newCharacter);
    } catch(e){
        console.log(e);
    }
});

// /* GET Items JSON. */
// router.get("/",async function (req, res, next) {
//     const db = await req.app.get("db")("items");
//     const items = await db.find().toArray();
//     res.json(items);
// });

// /* GET specific item by ID */
// router.get("/:item_id", async function(req,res,next){
//     const db = await req.app.get("db")("items");
//     const itemID = req.params.item_id;
//     const target = await db.findOne({_id: Number(itemID)});

//     res.json(target);
// });

// /* POST an item */
// router.post("/", async function(req,res,next){
//     const db = await req.app.get("db")("items");
//     let newItem = req.body;
//     try{
//        await db.insertOne(newItem);
//        res.status(201).json(newItem);
//     } catch(e){
//         console.log(e);
//     }
// });
router.put("/:character_id", async function (req,res,next){
    const db = await req.app.get("db")("characters");
    const replacedCharacter = req.body;
    await db.replaceOne(
        {
            _id: Number(req.params.character_id)
        },
        {
            ...replacedCharacter
        }
    );

    res.json(replacedCharacter)
});

router.delete("/:character_id", async function(req,res,next){
    const db = await req.app.get("db")("characters");
    await db.deleteOne({ _id: Number(req.params.character_id)});
    res.sendStatus(200);
});


// router.patch("/:item_id", async function(req,res,next){
//     const db = await req.app.get("db")("items");
//     await db.updateOne({
//         _id: Number(req.params.item_id)
//     },
//     {
//         $set: req.body
//     });
//     const updatedItem = await db.findOne({_id: Number(req.params.item_id)});

//     res.status(200).json(updatedItem)
// });

export { router as characterRouter };