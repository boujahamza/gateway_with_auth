//Validates if user is admin

const verifyRole = (req, res, next) => {
    
    const role = req.user.role;

    if(role === "admin"){
        return next();
    }else{
        console.log("unauthorized access");
        return res.status(401).send("Unauthorized");
    }
    
}

module.exports = verifyRole;