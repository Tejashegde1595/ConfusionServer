const mongoose = require('mongoose')
const schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const commentSchema = new schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    }
},
{
    timestamps:true
}
)



const dishSchema=new schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    comments:[commentSchema]
},
{
    timestamps:true
}
);

var Dishes = mongoose.model('dish',dishSchema);

module.exports = Dishes;