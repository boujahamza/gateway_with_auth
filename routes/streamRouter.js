const express = require("express");

const router = express.Router();

const httpProxy = require('express-http-proxy');

const auth = require('../middleware/auth');

const streamProxy = httpProxy("http://localhost:4006", {
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