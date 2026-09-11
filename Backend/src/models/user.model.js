import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    contact:{
        country:{type:String,required:true},
        number:{type:String,required:true,unique:true}
    },
    password:{type:String,required:true},
    fullName:{type:String,required:true},
    role:{
        type:String,
        enum:['buyer','seller'],  
        default:"buyer",

    }
})

// Seller Schema 

// const sellerSchema = new mongoose.Schema({
//     email:{type:String,required:true,unique:true},
//     contact:{type:String,required:true},
//     password:{type:String,required:true},
//     fullName:{type:String,required:true},
//     role:{
//         type:String,
//         enum:['buyer','seller'],
//         default:"seller",
//     }
// })

const userModel = mongoose.model('User',userSchema);
const sellerModel = mongoose.model('Seller',sellerSchema);

export { userModel, sellerModel };
