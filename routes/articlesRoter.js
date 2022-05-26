const express = require("express");

const ArticleRouter = express.Router();

const ImageRouter = express.Router();
const EventRouter = express.Router();

const httpProxy = require('express-http-proxy');

const auth = require('../middleware/auth');

const Proxy = httpProxy('http://localhost:3000', {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        if (srcReq.user) {
            proxyReqOpts.headers["user"] = JSON.stringify(srcReq.user);
        }
        return proxyReqOpts;
    }
})
ArticleRouter.get("/article", (req, res, next) => { Proxy(req, res, next); })
    .get("/article/:article_id", (req, res, next) => { Proxy(req, res, next); })
    .get("/article/:article_id/comment", (req, res, next) => { Proxy(req, res, next); })
    .get("/article/:user_id/article",  (req, res, next) => { Proxy(req, res, next); })
    .post("/article", auth,(req, res, next) => {Proxy(req, res, next) })
    .post("/article/:article_id/comment",auth, (req, res, next) => { //Need to add middleware to validate role
        Proxy(req, res, next);
    })

ImageRouter
    .get("/images", (req, res, next) => { Proxy(req, res, next); })
    .post("/images", (req, res, next) => {Proxy(req, res, next); })

EventRouter
 .get('/events',(req, res, next) => { Proxy(req, res, next); })
 .post("/events", (req, res, next) => {Proxy(req, res, next); })


module.exports = {
    ArticleRouter,
    ImageRouter,
    EventRouter
}
