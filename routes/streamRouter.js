const express = require("express");

const router = express.Router();

const httpProxy = require('express-http-proxy');

const auth = require('../middleware/auth');

const STREAM_URL =process.env.STREAM_URL;

const streamProxy = httpProxy(STREAM_URL, {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        if(srcReq.user) {
            proxyReqOpts.headers["user"] = JSON.stringify(srcReq.user);
        }
        return proxyReqOpts;
    },
    proxyReqBodyDecorator: function (bodyContent,srcReq) {
        if(srcReq.body.following){
            console.log(srcReq.body.title);
            bodyContent.title = srcReq.body.title;
        }
        return bodyContent;
    }
})

router.get("/lives/:id", (req,res,next) => {
    streamProxy(req,res,next);
});

router.get("/lives", (req,res,next) => {
    streamProxy(req,res,next);
});

router.get("/vods/:id", (req,res,next) => {
    streamProxy(req,res,next);
});

router.get("/vods", (req,res,next) => {
    streamProxy(req,res,next);
});

router.get("/streams/:id", (req,res,next) => {
    streamProxy(req,res,next);
})

router.get("/", (req,res,next) => {
    streamProxy(req,res,next);
})

router.post("/", auth, (req,res,next)=>{
    streamProxy(req,res,next);
});

router.delete("/", auth, (req,res,next)=>{
    streamProxy(req,res,next);
});

module.exports=router;