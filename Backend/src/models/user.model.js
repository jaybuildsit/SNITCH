import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


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




userSchema.pre('save',async function(){
    if(this.isModified('password')) return;

    const hash=awaitbcrypt.hash(this.password,10);
    this.password=hash;
})

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);

    

}

const userModel = mongoose.model('User',userSchema);
// const sellerModel = mongoose.model('Seller',sellerSchema);

export { userModel };
