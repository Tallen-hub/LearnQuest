const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({ path: "./config.env" });

const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

module.exports = {
    connectToServer: async () => {
        try {
            // Connect to MongoDB
            await client.connect();
            database = client.db("learnquest");

            // Create a unique index on the tutorId field
            await database.collection("tutorAvailability").createIndex({ tutorId: 1 }, { unique: true });
            console.log("Unique index created on tutorId.");
        } catch (err) {
            console.error("Error connecting to MongoDB or creating index:", err);
        }
    },

    getDb: () => {
        return database;
    }
};



/*async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir); */
