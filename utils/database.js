const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient;

const url='mongodb://127.0.0.1:27017'
const client =new MongoClient(url)

let _db;

const dbName='shop'
async function mongoConnect(runServerAfterDbConn){
    try{
        await client.connect()
        console.log('Connected to the database')
        _db=client.db(dbName)//setting the db to ensure that we are connected to db
        runServerAfterDbConn();
    }
    catch(err){
        console.log(err);
    }
}

const getDb=()=>{
    if(_db){//access the db that would have certain value after connecting to db
        return _db;
    }
    throw 'no database found' 
}
module.exports={mongoConnect,getDb}