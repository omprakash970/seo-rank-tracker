import jwt from 'jsonwebtoken';
const auth = async (req, res, next)=>{
    try{
        const authHeaders= req.headers.authorization;

        if(!authHeaders||!authHeaders.startsWith("Bearer ")){
            return res.status(401).json({success:false, message:"Unauthorized"});
        }
        const token = authHeaders.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }catch (err){
        console.error("Auth Middleware Error", err);

    }
}
export default auth;