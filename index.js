const express = require('express');
const app = express()
const { ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config()


app.use(cors())
app.use(express.json())

var MongoClient = require('mongodb').MongoClient;
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.nh8cc.mongodb.net:27017,cluster0-shard-00-01.nh8cc.mongodb.net:27017,cluster0-shard-00-02.nh8cc.mongodb.net:27017/?ssl=true&replicaSet=atlas-1089r9-shard-0&authSource=admin&retryWrites=true&w=majority`;
MongoClient.connect(uri, function (err, client) {

    async function run() {
        try {
            await client.connect()
            const projectCollection = client.db('portfolio').collection('projects')

            app.get('/projects', async (req, res) => {
                const projects = await projectCollection.find({}).toArray()
                res.send(projects)
            })

            app.get('/projects/:id', async (req, res) => {
                const id = req.params.id

                const query = { _id: ObjectId(id) }
                const result = await projectCollection.findOne(query)
                res.send(result)
            })

        } finally {

        }

    }

    run().catch(console.dir)

})

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log('Port is running', port)
})