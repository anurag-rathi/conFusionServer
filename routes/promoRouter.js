const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

const mongoose = require("mongoose");
const Promotions = require("../models/promotions");
var authenticate = require("../authenticate");
const cors = require("./cors");

promoRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promotions.find({})
      .then(
        (promos) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promos);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.create(req.body)
        .then(
          (promo) => {
            console.log("Promo Created", promo);

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation is not supported on /promotions");
    }
  )

  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.remove({})
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

promoRouter
  .route("/:promoId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        "POST operation is not supported on /promotions/" + req.params.promoId
      );
    }
  )

  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.findByIdAndUpdate(
        req.params.promoId,
        { $set: req.body },
        { new: true }
      )
        .then(
          (promo) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )

  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.findByIdAndDelete(req.params.promoId)
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );
module.exports = promoRouter;
