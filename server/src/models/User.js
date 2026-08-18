import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type:String,
            required: true,
            unique: true,
            lowercase: true,

        },

        password:{
            type:String,
            
        },

        googleId:{
            type:String,
        },

        role:{
            type: String,
            enum:["user", "admin"],
            default: "user",
        },

        favorites:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
        },]

    },{timestamps: true}
);

export default mongoose.model("User", userSchema);
