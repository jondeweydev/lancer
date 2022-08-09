const ListingDB = require("../models/listingModel");

const listingController = {};

listingController.getListings = (req, res, next) => {
  ListingDB.find({}, (err, listings) => {
    if (err) {
      return next(
        "Error in listingController.getListings: " + JSON.stringify(err)
      );
    }
    // adds received listings to res.locals for further use
    res.locals.listings = listings;
    console.log("Listings received from database");
    return next();
  });

  // ListingDB.collection.dropIndexes({'listingId': 1}, (err)=>{
  //   if(err)console.log('err')
  //   else console.log('yay')
  //   return next();
  // })
};

// /:id to find user's listings
listingController.getUserListings = (req, res, next) => {
  const handle = req.body.handle ? req.body.handle : req.params.id;
  ListingDB.find({ handle: handle }, (err, listings) => {
    if (err) {
      return next(
        "Error in listingController.getListings: " + JSON.stringify(err)
      );
    }
    // adds received listings to res.locals for further use
    let max = 0;
    listings.forEach((el, i) => {
      if (el.listingId > max) {
        max = el.listingId;
      }
    });
    console.log(max);
    res.locals.userListings = listings;
    res.locals.userListingAmount = max;
    console.log("Listings received from database");
    return next();
  });
};

listingController.createListing = (req, res, next) => {
  if (
    req.body.handle &&
    req.body.title &&
    req.body.service &&
    req.body.zip &&
    req.body.hourly
  ) {
    const newListing = {
      listingId: parseInt(res.locals.userListingAmount) + 1,
      handle: req.body.handle,
      uniqueId: req.body.handle + "_" + (res.locals.userListingAmount + 1),
      title: req.body.title,
      service: req.body.service,
      zip: "" + req.body.zip,
      hourly: "" + req.body.hourly,
    };

    console.log(JSON.stringify(newListing));

    ListingDB.create(newListing, (err, listing) => {
      if (err) {
        return next(
          "Error in listingController.createListing: " + JSON.stringify(err)
        );
      }
      console.log("New listing has been saved to database.");
      return next();
    });
  } else return next("All fields are required to add a listing.");
};

// updates listing with fields from req.body.update (svc, rate, zip)
// url -> '/:id'
listingController.updateListing = (req, res, next) => {
  if (!req.body.update)
    return next(
      "At least one field is required in the request body's update property."
    );

  ListingDB.findOneAndUpdate(
    { listingNumber: req.params.id },
    req.body.update,
    null,
    (err, listing) => {
      if (err)
        return next(
          "Error finding listing in listingController.updateListing: " +
            JSON.stringify(err)
        );
      if (!listing)
        return next("The listing ID given in request query does not exist.");

      console.log("Specified listing has been updated with the given fields.");
      return next();
    }
  );
};

listingController.deleteListing = (req, res, next) => {
  ListingDB.findOne({ listingId: req.params.id }, (err, listing) => {
    if (err)
      return next(
        "Error finding listing in listingController.deleteListing: " +
          JSON.stringify(err)
      );
    if (!listing) return next("Listing not found");

    UserDB.deleteOne({ listingId: listing.listingId }, (err, result) => {
      if (err)
        return next(
          "Error deleting listing in listingController.deleteListing: " +
            JSON.stringify(err)
        );
      console.log("Sepcified listing deleted from database");
      return next();
    });
  });
};

module.exports = listingController;
