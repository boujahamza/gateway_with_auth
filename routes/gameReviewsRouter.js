const express = require("express");

const router = express.Router();

const httpProxy = require('express-http-proxy');

const auth = require('../middleware/auth');

const gameReviewsProxy = httpProxy("http://localhost:5000", {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        if(srcReq.user) {
            proxyReqOpts.headers["user"] = JSON.stringify(srcReq.user);
        }
        return proxyReqOpts;
    }
})

router.get("/games", (req,res,next)=>{
    gameReviewsProxy(req,res,next);
});

router.get("/games/:id", (req,res,next)=>{
    gameReviewsProxy(req,res,next);
});

router.get("/games/:id/reviews",(req,res,next)=>{
    gameReviewsProxy(req,res,next);

})

router.post("/games/:id/reviews", auth,(req,res,next)=>{
    gameReviewsProxy(req,res,next);
})

router.post("/games", auth,(req,res,next)=>{ //Need to add middleware to validate role
    gameReviewsProxy(req,res,next);
});

router.delete("/games/:id", auth,(req,res,next)=>{
    gameReviewsProxy(req,res,next);
})

module.exports=router;