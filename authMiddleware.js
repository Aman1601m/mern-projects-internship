const jwt = require("jsonwebtoken");
const authMiddleware = (req,res,next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            message:"Access denied"
        });

    }
    next();
}
module.exports = authMiddleware;