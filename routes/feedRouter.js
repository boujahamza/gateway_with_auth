const express = require("express");

const router = express.Router();

const httpProxy = require('express-http-proxy');

const auth = require('../middleware/auth');
const FEED_URL=process.env.FEED_URL;

const feedProxy = httpProxy(FEED_URL, {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        if(srcReq.user) {
            proxyReqOpts.headers["user"] = JSON.stringify(srcReq.user);
        }
        return proxyReqOpts;
    },
    proxyReqBodyDecorator: function (bodyContent,srcReq) {
        if(srcReq.body.following){
            bodyContent.following = srcReq.body.following;
        }
        return bodyContent;
    }
})

router.post("/", (req,res,next)=>{
    console.log("hh");
    feedProxy(req,res,next);
});

module.exports=router;