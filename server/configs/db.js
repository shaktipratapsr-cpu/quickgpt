import mongoose from 'mongoose';

const connectDB = async () =>{
    try {
        mongoose.connection.on('connected', ()=> console.log('Database connected'))
        // Remove trailing slashes from base URI to avoid invalid namespaces
        const baseUri = (process.env.MONGODB_URI || '').replace(/\/+$/, '')
        await mongoose.connect(`${baseUri}/quickgpt`)
    } catch (error) {
        console.log(error.message)
    }
}

export default connectDB;