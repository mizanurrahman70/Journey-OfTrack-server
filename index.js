const express =require ('express')
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port=process.env.PORT||5000
const app=express()
app.use(cors())
app.use(express.json())
// 
// 
app.get('/',(req,res)=>{
    res.send('This is your Backend site')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@touristbd.ejksewc.mongodb.net/?retryWrites=true&w=majority&appName=TouristBD`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("toristBD");
    const toristList = database.collection("ToristList");
    const allToristSides = database.collection("tourist_sides");
    // Send a ping to confirm a successful connection

   app.get('/toristSports',async(req,res)=>{
    let query = {};
    const subCatagori = req.query.Sub_Catagori; // Access query parameter
    if (subCatagori) {
      query = { Sub_Catagori: subCatagori };
    }

    const touristSpots = await allToristSides.find(query).toArray();
    res.send(touristSpots)
   })
   app.get('/toristSport/:country_Name',async(req,res)=>{
   const countryNameId=req.params.country_Name
   const quari={countryName: countryNameId}
   
   const result =await toristList.find(quari).toArray()
  
   res.send(result)
   })







    // main part
    app.get('/details/:id',async(req,res)=>{
      const id =req.params.id
      const quari= {_id: new ObjectId(id)}
      const result=await toristList.findOne(quari)
      res.send(result)
    })
    app.get('/mylist/:authEmail',async(req,res)=>{
      const email=req.params.authEmail
      const quari={authEmail: email }
      const find=toristList.find(quari)
      const result=await find.toArray()
      res.send(result)
    })
app.get('/torists_sides',async(req,res)=>{
  const find=toristList.find()
  const result=await find.toArray()
  res.send(result)
})
 app.post('/torists_sides',async(req,res)=>{
 const sides=req.body
 
 const result = await toristList.insertOne(sides)
 res.send(result)
 })
 app.put('/details/:id',async(req,res)=>{
  const id =req.params.id
  const user=req.body
  const quari={_id: new ObjectId(id)}
  const options = { upsert: true };
  const userUpdate ={
    $set:{
      toristSportName:user.toristSportName,
      countryName:user.countryName,
      average_cost:user.average_cost,
      seasonality:user.seasonality,
      travel_time:user.travel_time,
      totaVisitorsPerYearuser:user.totaVisitorsPerYearuser,
      emailuser:user.emailuser,
      name:user.name,
      shortDescripion:user.shortDescripion,
      imgURL:user.imgURL,
    }
   
  }

  const result =await toristList.updateOne(quari,userUpdate,options)
  
  res.send(result)
 })
 app.delete('/details/:id', async(req,res)=>{
   const id =req.params.id
  
   const quari={_id: new ObjectId (id)}
   const result=await toristList.deleteOne(quari)
 
   res.send(result)
 })



    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`Your website is Raning${port}`)
})