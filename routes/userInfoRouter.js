const express = require("express");

const router = express.Router();

const httpProxy = require('express-http-proxy');

const auth = require('../middleware/auth');

const gameReviewsProxy = httpProxy("http://localhost:4003", {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        if(srcReq.user) {
            proxyReqOpts.headers["user"] = JSON.stringify(srcReq.user);
        }
        return proxyReqOpts;
    }
})

router.post("/:user_id/follow", auth, (req,res,next)=>{
    gameReviewsProxy(req,res,next);
});

router.post("/:user_id/unfollow", auth, (req,res,next)=>{
    gameReviewsProxy(req,res,next);
});

router.get("/:user_id/followers",(req,res,next)=>{
    gameReviewsProxy(req,res,next);

})

router.get("/:user_id/following",(req,res,next)=>{
    gameReviewsProxy(req,res,next);
});

module.exports=router;