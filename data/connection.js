const mongoose = require('mongoose')
// TODO utilizar varibales de entorno
const uri = process.env.MONGO_URI

let instance = null;

async function getConnection(){
    if(instance == null){
        try {
            instance = await mongoose.connect(uri,{
                useNewUrlParser: true,
                useUnifiedTopology: true,
                //useCreateIndex: true,
                //useFindAndModify: false            
            });
            // console.log(instance)
        } catch (err) {
            console.log(err.message);
            throw new Error('Error al conectarse con mongoose');
        }
    }
    return instance;
}

module.exports = {getConnection};