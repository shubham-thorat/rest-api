import { Router } from "express";
import Movie from "../models/movieSchema.js";
import changeID from "../helpers/changeID.js";
const router = Router()

//@METHOD GET
//@desc get all movies from database
//@visibility public
router.get('/', (req, res) => {

    Movie.find({}, { _id: false, __v: false }, (error, result) => {
        if (error) return res.status(500).json({ "message": error });
        if (result.length === 0) {
            return res.status(404).json({ "message": "Items not found" })
        }
        res.status(200).json(result);
    })
})


//@METHOD GET
//@desc single movie with given id
//@visibility public
router.get('/:id', (req, res) => {
    const id = req.params.id
    Movie.findOne({ movieID: id }, { _id: false, __v: false }, (error, docs) => {
        if (docs == null) {
            return res.status(404).json({ "message": "Items not found" })
        }
        else
            res.status(200).json(docs);
    })
})

//@METHOD POST
//@desc add movies to database for public
//@visibility public
router.post('/', async (req, res) => {
    const { title, image_url, year, rating, overview } = req.body
    try {

        const newID = await changeID(0, "movies");
        let len = newID + 1;

        const newMovie = new Movie({ movieID: len, title, image_url, year, rating, overview })

        newMovie.save(async (err, docs) => {
            if (err) {
                return res.status(201).json({ "message": err.message })
            }
            await changeID(1, "movies");
            const { movieID, title, image_url, year, rating, overview } = docs
            return res.status(201).json({
                "movieID": movieID,
                "title": title,
                "year": year,
                "image_url": image_url,
                "rating": rating,
                "overview": overview
            })
        })
    } catch (err) {
        return res.json({ "message": err.message })
    }
})

export default router