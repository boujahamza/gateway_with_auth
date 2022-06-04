const express = require("express");

const router = express.Router();

const httpProxy = require('express-http-proxy');

const auth = require('../middleware/auth');

const gameReviewsProxy = httpProxy("http://localhost:4001", {
    proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
        if(srcReq.user) {
            proxyReqOpts.headers["user"] = JSON.stringify(srcReq.user);
        }
        return proxyReqOpts;
    }
})

router.get("/", (req,res,next)=>{
    gameReviewsProxy(req,res,next);
});

router.get("/:id", (req,res,next)=>{
    gameReviewsProxy(req,res,next);
});

router.get("/:id/reviews",(req,res,next)=>{
    gameReviewsProxy(req,res,next);

})

router.post("/:id/reviews", auth,(req,res,next)=>{
    gameReviewsProxy(req,res,next);
});

const validateRole = require("../middleware/roleValidation");

router.post("/", auth, validateRole,(req,res,next)=>{
    gameReviewsProxy(req,res,next);
});

router.delete("/:id", auth,(req,res,next)=>{
    gameReviewsProxy(req,res,next);
})

router.get("count", auth, validateRole, (req,res,next) => {
    gameReviewsProxy(req,res,next);
})

module.exports=router;