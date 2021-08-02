'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv')
const  mongoose  = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json())
const PORT = process.env.PORT ;


mongoose.connect(`${process.env.MONGODB}`, {useNewUrlParser: true, useUnifiedTopology: true});

const places = new mongoose.Schema({
placeName: String,
placeImg: String
})

const userSchema = new mongoose.Schema({
  email: String,
  userPlaces: [places]
})

const UserModel = mongoose.model('Places', userSchema )



function seedtheCollection() {
  let maram = new UserModel({
    email:'maramabumurad97@gmail.com',
    userPlaces:[{
      placeName:'Wadi Rum',
      placeImg: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/f0/a4/f6/beyond-wadi-rum-camp.jpg?w=900&h=-1&s=1'
    }]
  })
  maram.save()
}

// seedtheCollection();

class PlacesClass
{
  constructor(placeName,placeImg){
    this.placeName= placeName,
    this.placeImg=placeImg
  }
}

app.get('/places' , async (req,res) =>{
let url = 'https://jordan-black-iris.herokuapp.com/places'
let apiData = await axios.get(url)
let placesData = apiData.data.map(element =>{
  return new PlacesClass (element.name , element.img)
})
// console.log(placesData);
res.send(placesData)
})
////////////////////////////////////////////////
app.post('/addtofavs/:email', (req,res)=>{
  let email = req.params.email
const {placeName, placeImg} = req.body
console.log(email, '---', placeName);
UserModel.find({ email: email }, (error, Data) => {
  if (error) {
      res.send(error)
  }
  else {
      Data[0].userPlaces.push(
          {
            placeName:placeName,
            placeImg:placeImg
          }
      )
      Data[0].save()
  }
})
})

///////////////////////////////////////
app.get('/favs',(req,res)=>{
  let email = req.query.email
  console.log(req.query.email);
  UserModel.find({email:email}, (error, Data)=>{
    if (error){
      res.send(error)
    }else{
      res.send(Data[0].userPlaces)
    }
  })
})
////////////////////////////////////////

app.delete('/deletePlace/:idx', (req, res) =>{
  let email = req.query.email
  let index = Number(req.params.idx)
  UserModel.find({email:email}, (error , data)=>{
    if (error){
      res.send(error)
    } else{
      let filtered = data[0].userPlaces.filter((element, elementIdx)=>{
        if(elementIdx !== index){ return element}
      })
       data[0].userPlaces = filtered
       data[0].save()
       res.send(data[0].userPlaces)
    }
   
  })
})

////////////////////////////////////////////////
app.put('/updatePlace/:idx' , (req , res) =>{
  let email = req.query.email
  let index = req.params.idx
  const {placeName , placeImg} = req.body
  UserModel.find({email:email}, (error, data)=>{
    if(error){
      res.send(error)
    } else {
      data[0].userPlaces.splice(index , 1 , {
        placeName:placeName,
        placeImg:placeImg
      })
      data[0].save()
      res.send(data[0].userPlaces)
    }
  })
})














///////////////////////////////////////
app.get('/', (req, res) => {
res.send('All Good')
  





})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
