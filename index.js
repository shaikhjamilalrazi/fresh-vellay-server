const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfzrp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    const productCollection = client.db("freashValley").collection("products");

    const orderCollection = client.db("freashValley").collection("orders");

    // Insert data api
    app.post("/addProduct", (req, res) => {
        const newEvent = req.body;
        productCollection.insertOne(newEvent).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // Getting Data api
    app.get("/allProducts", (req, res) => {
        productCollection.find().toArray((err, products) => {
            res.send(products);
        });
    });

    // Delete api
    app.delete("/deleteProduct/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        productCollection
            .findOneAndDelete({ _id: id })
            .then((result) => console.log(result));
    });

    // Get single product
    app.get("/Product/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        productCollection.find({ _id: id }).toArray((err, product) => {
            res.send(product[0]);
        });
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port);
