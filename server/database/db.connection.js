import {MONGO_URI} from '../config/env.js'
import mongoose from 'mongoose';

if(!MONGO_URI){
    throw new Error('Mongo URI is missing')
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('Database connected successfully') 
    } catch (error) {
        console.log('error occured when connecting to database', error)
        process.exit(1)
    }
}

export default connectDB