import  experss from 'express';
import cors from 'cors';
import "dotenv/config"
import connectDB from "./config/db.js";
import dns from "dns";
import authRouter from "./Routes/authRoutes.js";

dns.setServers([
    "1.1.1.1", "8.8.8.8"
]);


connectDB()

const app = experss();
app.use(cors());
app.use(experss.json());

app.get('/', (req, res)=>{
    res.send("Server is running");
})
app.use("/api/auth", authRouter)
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{

    console.log(`Server is running on ${ PORT }`);
    console.log('Visit http://localhost:' + PORT);
})
