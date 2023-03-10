
const express=require('express');
const app =express();
const port=process.env.PORT||5000;
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


app.use(cors());
app.use(express.json());

const userName=process.env.DB_USER;
const password=process.env.DB_PASSWORD;

const uri = `mongodb+srv://${userName}:${password}@cluster0.hymefqt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const userALLCollection=client.db('Photography').collection('userCollention');
        const orderCollection=client.db('Photography').collection('orders');
        
        app.get('/services', async(req,res)=>{
            const query={};
            const cursor=userALLCollection.find(query);   
            const services=await (await cursor.toArray()).slice(0,3);
            res.send(services);
        });

        app.get('/allservices', async(req,res)=>{
            const query={};
            const cursor=userALLCollection.find(query);   
            const allservices=await (await cursor.toArray());
            res.send(allservices);
        });

        

        app.get('/services/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const service=await userALLCollection.findOne(query);
            res.send(service);
        })

        app.get('/checkouts/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const checkouts=await userALLCollection.findOne(query);
            res.send(checkouts);
        })

        app.post('/users',(req,res)=>{
            const user=req.body;
            user.id=users.length+1;
            users.push(user);
            res.send(user)
        });

        app.post('/orders', async(req,res)=>{
            const order=req.body;
            const result=await orderCollection.insertOne(order);
            res.send(result);
        });


        app.get('/orders', async(req,res)=>{
            
            let query={};
            if (req.query.email) {
                query={
                    email:req.query.email
                }
            }
            const cursor=orderCollection.find(query);
            const orders=await cursor.toArray();
            res.send(orders);
        });
        

    }
    finally{}
}
run().catch(err=>console.log(err));


app.get('/', (req,res)=>{
    res.send('Photography');

})
app.listen(port,()=>{
    console.log('Photograpy News',port)
})