import express from 'express'
import mongoose, { mongo } from 'mongoose'
import multer from 'multer';
import path from 'path'
const app=express();
const port=1000;


import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({ 
    cloud_name: 'dsdwkst1m', 
    api_key: '496639793474817', 
    api_secret: 'jGYRrry_vP6il7S24-Re7pvtPFI' // Click 'View API Keys' above to copy your API secret
});


app.use(express.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost:27017/nodejs_express_api_series").then(()=>{
    console.log("Mongo db connected");
}).catch((error)=>{console.log(error)});


app.get('/',(req,res)=>{
    res.render("index.ejs",{url:null});
})



const storage = multer.diskStorage({
    // destination: './public/uploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })
  

  const upload = multer({ storage: storage })


const fileSchema=new mongoose.Schema({
  fileName:String,
  public_id:String,
  imgUrl:String
})

const File=mongoose.model("Cloudinary",fileSchema)
  app.post('/upload', upload.single('file'), async (req, res)=> {
    // console.log("This is my file",req.file)
    // res.send("File is being uploaded");
    const file=req.file.path

    const cloudinary1=await cloudinary.uploader.upload(file,{
        folder:'NodeJs_Express_API_Series'
    })

    //Save to Database

    const saveToDb=await File.create({
      fileName:cloudinary1.original_filename,
      public_id:cloudinary1.public_id,
      imgUrl:cloudinary1.secure_url
    })
    console.log("cloudinary response",cloudinary1,saveToDb)
    res.render("index.ejs",{url:cloudinary1.secure_url})
  })

app.listen(port,()=>{
    console.log(`server is running at port ${port}`)
})