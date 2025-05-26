const jwt=require("jsonwebtoken");
const SECRET_KEY="abdelilahabdo123";

function auth(req, res,next){
     const authHeader = req.headers['auth'];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token not provided or invalid format" });
    }
    const token = authHeader.split(" ")[1];
    if(!token){
        res.json({message:"you are not authenticated"});

    }
     
    jwt.verify(token, SECRET_KEY,(err, user)=>{
        if(err){
            return res.json({message:"you are not authenticated"});
        }
        req.user = user;
        next();
    })
}
module.exports=auth;
