import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true,
    unique:true
  },

  full_name:{
    type:String,
    required:true
  },

  phone_number:{
    type:String,
    required:true
  },

  addresses:[
    {
      _id:{
        type:mongoose.Schema.Types.ObjectId,
        default:()=>new mongoose.Types.ObjectId()
      },
      label:{
        type:String,
        required:true
      },
      address:{
        type:String,
        required:true
      }
    }
  ],

  cart:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Cart'
  },

  orders:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Order'
    }
  ],

  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Review'
    }
  ]

},{timestamps:true});

export const Customer = mongoose.model('Customer', customerSchema);
