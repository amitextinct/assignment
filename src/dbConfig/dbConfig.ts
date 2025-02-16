import mongoose from "mongoose";

export default async function connect (){
    try{
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection;
        connection.on('connected', ()=>{
            console.log('MongoDB connected successfully');
        })

        connection.on('error',(err) => {
            console.log("error connecting to mongobd" + err);
        })
    }
    catch(err){
        console.log("cannot connect to the database" + err)
    }
}