const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.goerh3z.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    // Send a ping to confirm a successful connection
    app.get('/', (req, res) => {
      res.send('Server Api is running')
    });

    const productsCollection = client.db('toyMertDB').collection('products');
   
    app.get("/all-product", async (req, res) => {
      const results = await productsCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.send(results);
    });

    

    app.post("/add-product", async (req, res) => {
      const body = req.body;
      body.createdAt = new Date();
      const result = await productsCollection.insertOne(body);
      if (result?.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "can not insert try again leter",
          status: false,
        });
      }
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");


  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server API is running on port ${port}`)
})