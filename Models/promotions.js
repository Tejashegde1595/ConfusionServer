const mongoose = require('mongoose')
const schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promoSchema = new schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    label:{
        type:String,
        required:false,
        default:''
    },
    price:{
        type:Currency,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
}
);

const promotions = mongoose.model('promotions',promoSchema);

module.exports = promotions;
