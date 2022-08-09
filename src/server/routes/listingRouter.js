const express = require('express');

const listingController = require('../controllers/listingController')

const router = express.Router();

// route to get local listings
// middleware: getListings
// sends back response body of listings

router.get('/', listingController.getListings, (req, res)=>{
    return res.json(res.locals.listings);
})

router.get('/:id', listingController.getUserListings, (req, res)=>{
    return res.json(res.locals.userListings);
})

// route to post a new listing
// sends back response body of listings

router.post('/', listingController.getUserListings, listingController.createListing, (req, res)=>{
    return res.json(res.locals.listings);
})

// route to update an existing listing
// sends back response body of listings
// specify listing ID with req.params.id

router.put('/:id', listingController.updateListing, listingController.getListings, (req, res)=>{
    return res.json(res.locals.listings);
})

// route to delete an existing listing
// sends back response body of listings

router.delete('/:id', listingController.deleteListing, listingController.getListings, (req, res)=>{
    return res.json(res.locals.listings);
})

module.exports = router;