const schema = require('mongoose').Schema;
const mongoose = require('mongoose');


const FavoriteSchema = new schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    dishid:{
        type:mongoose.Schema.Types.Array,
        ref:'dish',
        required:true
    }
},
    {
        timestamps:true
    }
);




const favourites = mongoose.model('favourites',FavoriteSchema);

module.exports = favourites;