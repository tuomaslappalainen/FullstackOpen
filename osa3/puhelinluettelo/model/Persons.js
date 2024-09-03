require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).catch((err) => {
  if (err.code === 8000) console.log('Incorrect password');
});

console.log('Connected');

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: [true, 'Name required'],
    },
    number: {
      type: String,
      required: [true, 'User phone number required'],
      validate: {
        validator: function (v) {
          return /\d{2,3}-\d{6}/.test(v);
        },
        message: (props) => {
          if(props.value.length >= 8){
            return `${props.value} is not a valid phone number. It must be like ${props.value.split('').toSpliced(2,0,'-').join('')} or ${props.value.split('').toSpliced(3,0,'-').join('')}`;
          }
        },
      },
      minLength: 8,
    },
  },
  { strict: 'throw' }
);

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);