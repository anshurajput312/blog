// // const express = require('express');
// // const app = express()

// // app.get('/', (req,res)  => {
// //     // to show the response with status code
// //     res.status(200).send('Getapi hit')
// // })

// // app.get('/student', (req,res)  => {
// //     // to show the response with status code
// //     res.status(200).send('Getapi hit student')
// // })

// // app.get('/admin', (req,res)  => {
// //     // to show the response with status code
// //     res.status(200).send('Getapi hit admin')
// // })

// // app.get('/faculty', (req,res)  => {
// //     // to show the response with status code
// //     res.status(200).send('Getapi hit faculty')
// // })

// // app.listen(3000, ()=> {
// //     console.log('application running on port 3000')
    
// // })


// // const express = require('express');
// // const mongoos = require('mongoos');
// // const app = express();

// app.use(express.json())
// //To stablish the mongoDB with express
// mongoose.connect("mongodb://rajputanshu312_db_user:Anshu%40312@ac-8safw6c-shard-00-00.gacnszl.mongodb.net:27017,ac-8safw6c-shard-00-01.gacnszl.mongodb.net:27017,ac-8safw6c-shard-00-02.gacnszl.mongodb.net:27017/?ssl=true&replicaSet=atlas-evw133-shard-0&authSource=admin&appName=Cluster0/blogdb")

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// To load dotenv configuration
dotenv.config()
const app = express()
app.use(express.json());

//
app.get('/home',(req,res) =>{
    res.status(200).send("this is home page")
})

//To stablish the mongoDB connection with express
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('mongo database connected');
})
.catch(
    err => console.error("Error is ",err)
)

//create user Schema with title and desc
const userSchema = new mongoose.Schema({
    user:{type:String, required:true},
    description:{type:String,required:true},
    emailid:{type:String,required:true}
})

const User = mongoose.model("User",userSchema);
//create insert User API
app.post('/',async (req,res) =>{
    //To handle the error using try catch
    try {
        const user = await User.create(req.body)
        res.status(201).json(user)

    } catch (error) {
        res.status(400).json({error:error.message})
    }    
})
//Read the user form mongoDB
app.get('/',async (req,res) => {
    const user = await User.find();
    res.status(200).json(user)

})

//Delete User by id 
app.delete('/:id',async (req,res) =>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        res.status(200).json(user)
    }catch(error) {
        res.status(400).json({error:error.message})
    }
})

//Update User by id 
app.put('/', async (req,res) =>{
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.params.body,
            {new:true}
        );
        response.status(201).json(user)
    } catch (error) {
        console.log(error)
    }
})




app.listen(process.env.PORT, () =>{
    console.log("Server is running on PORT",process.env.PORT);
})