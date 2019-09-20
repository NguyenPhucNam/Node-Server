"use strict";

const About = require("../models/aboutModel");
const Product = require('../models/productsModel');
const redis = require('redis');

const client = redis.createClient();

exports.homePage = (req, res, next) => {
    new Promise((resolve, reject) => {
      client.hget('key', 'all',(err, obj) => {
          if(err) {
              reject(err);
          } else {
              resolve(obj);
          }
        });
    })
    .then(reply => {
      if(reply) {
        res.status(200).json(JSON.parse(reply));
      } else {
        Product.find({Enable: true},{__v: 0}).skip(3).sort({Create_at: -1})
        .exec()
        .then(result => {
            result.map(imgEdit => {
                let	propImg = 'Img_Product',
                    position = imgEdit.Img_Product.indexOf(',');
                if(imgEdit.Img_Product.length !== position) {
                  imgEdit[propImg] = imgEdit.Img_Product.split(",", 1);
                } else {
                  imgEdit[propImg] = imgEdit.Img_Product;
                }
                return imgEdit;
            });
            new Promise((resolve, reject) => {
              client.hmset('key', 
              [
                "all", JSON.stringify(result)
              ], (err, obj) => {
                  if(err) {
                      reject(err);
                  } else {
                      resolve(obj);
                  }
              });
            })
            .then(() => res.status(200).json(result))
            .catch(err => res.status(500).send(err));
        }).catch((err) => {
            res.status(404).json("Not Found" + err);
        });
      }
    })
    .catch(err => res.status(500).send(err));
}


exports.categoryAll = (req, res, next) => {
  console.log(req.query);
  var limitPage = 3;
  var currentPage = (req.query.page - 1) * limitPage;
  Product.find({Enable: true},{__v: 0})
  .limit(limitPage)
  .skip(currentPage)
  .sort({Create_at: -1})
  .exec()
  .then(result => {
      result.map(imgEdit => {
          let	propImg = 'Img_Product',
              position = imgEdit.Img_Product.indexOf(',');
          if(imgEdit.Img_Product.length !== position) {
            imgEdit[propImg] = imgEdit.Img_Product.split(",", 1);
          } else {
            imgEdit[propImg] = imgEdit.Img_Product;
          }
          return imgEdit;
      });
      res.status(200).json(result);
  }).catch((err) => {
      res.status(404).json("Not Found" + err);
  });
}

exports.aboutPage = (req, res, next) => {
    About.find({}, {__v: 0})
    .exec()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json(err));
}
