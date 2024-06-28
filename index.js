const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhnq0hd.mongodb.net/?appName=Cluster0`;
// console.log(uri)

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

        const database = client.db('swapnashray');
        const booksCollection = database.collection('books');
        const membersCollection = database.collection('members');
        const applicationCollection = database.collection('applications');

        app.get('/category/books', async (req, res) => {
            const { category } = req.query;

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;

            console.log(category);

            const query = { bookCategory: category };
            if (category === 'all') {
                const books = await booksCollection.find().skip(skip).limit(limit).toArray();
                const totalBooks = await booksCollection.countDocuments();
                const totalPage = Math.ceil(totalBooks / limit);
                res.send({ books, totalPage, totalBooks });
            }
            else {
                const books = await booksCollection.find(query).skip(skip).limit(limit).toArray();
                const totalBooks = await booksCollection.countDocuments();
                const totalPage = Math.ceil(totalBooks / limit);
                res.send({ books, totalPage, totalBooks });
            }
        })

        app.get('/search-books', async (req, res) => {
            const { searchValue } = req.query;
            // console.log(searchValue);
            const result = await booksCollection.find({
                $or: [
                    { 'bookName': { $regex: searchValue, $options: 'i' } },
                    { 'author': { $regex: searchValue, $options: 'i' } }
                ]
            }).toArray();
            res.send(result)
            console.log(result);
        })

        app.get('/members', async (req, res) => {
            const { category } = req.query;
            console.log(category);

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;

            const query = { memberCategory: category }
            const result = await membersCollection.find(query).skip(skip).limit(limit).toArray();
            const totalMembers = await membersCollection.countDocuments();
            const totalPage = Math.ceil(totalMembers / limit);
            res.send({ result, totalPage, totalMembers })
        })

        app.get('/get-applications', async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;

            const result = await applicationCollection.find().skip(skip).limit(limit).toArray();
            const totalApplications = await applicationCollection.countDocuments();
            const totalPage = Math.ceil(totalApplications / limit);
            res.send({ result, totalPage, totalApplications });
        })

        // post request
        app.post('/add-book', async (req, res) => {
            const bookInfo = req.body;
            const { bookIdentityNo } = bookInfo;
            const query = { bookIdentityNo: bookIdentityNo }
            const findBook = await booksCollection.findOne(query);
            if (findBook) {
                res.send({ message: 'already added this book' })
                return;
            }
            const result = await booksCollection.insertOne(bookInfo);
            res.send(result)
            // console.log(bookInfo);
        })

        app.post('/add-member', async (req, res) => {
            const memberInfo = req.body;
            console.log(memberInfo);
            const result = await membersCollection.insertOne(memberInfo);
            res.send(result);
        })

        app.post('/member-application', async (req, res) => {
            const applicantInfo = req.body;
            console.log(applicantInfo);
            const result = await applicationCollection.insertOne(applicantInfo);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Swapnashray server is running');
})
app.listen(port, () => {
    console.log(`Swapnashray server is running on port ${port}`)
})
