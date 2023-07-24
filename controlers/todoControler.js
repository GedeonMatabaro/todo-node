const bodyParser=require('body-parser');
const express = require('express');
const app=express();
const { ObjectId } = require('mongodb');
// var mongoose = require('mongoose');
const {connectToDb, getDb}=require ('./db')
const urlencodedParser=bodyParser.urlencoded({extended:false});
// var data=[
//     {item:'get milk'},
//     {item:'do home work'},
//     {item: 'See her'}
// ];
app.use(express.json());
let db
//connect to mongodb
connectToDb((err)=> {
    if(!err){
        db=getDb()
        console.log('connected to mongodb ')
    }
    else{
        console.log('fail to connect to mongodb')
    }
})
// mongoose.connect('mongodb://localhost')
module.exports = function(app){
    app.get('/todo', function(req, res){
        let tasks =[];
        db.collection('tasks')
            .find()
            .forEach(task => {
                // if(task){
                //     console.log(task);
                // }
                
                return tasks.push(task)})
            .then(()=>{
                res.render('todo',{todos:tasks});
            })
            .catch(()=>{
                res.status(500).json({error: "Could not fetch the document"})
            })
        //  res.render('todo',{todos:tasks});
    });
     app.get('/todo/:id',  (req, res) => {

        db.collection('tasks')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc=>{
            res.status(200).json(doc);
        })
        .catch(err=>{
            res.status(500).json({error: "Could not fetch the document"})
        })
    });
    
    
    app.post('/todo', urlencodedParser, function(req, res){
            const tasky = req.body

            db.collection('tasks')
                .insertOne(tasky)
                .then(result=>{
                res.status(200).json(result)
                })
                .catch(err=>{
                res.status(500).json({err: "Coulf not create a new doc"})
                })
    });
  /*  app.post('/todo', (req, res)=>{
        const tasky = req.body

        db.collection('tasks')
          .insertOne(tasky)
          .then(result=>{
            res.status(200).json(result)
          })
          .catch(err=>{
            res.status(500).json({err: "Coulf not create a new doc"})
          })
    }); 
    */

    // app.delete('/todo/:item', function(req, res){
    
    //    data = data.filter( function(todo) {
    //         return todo.item.replace(/ /g, "-") !== req.params.item ;
    //    });
    //    res.json(data);
    // });

    app.delete('/todo/:item', function(req, res){

        if(ObjectId.isValid(req.params.item)){
            db.collection('tasks')
            .deleteOne({_id: new ObjectId(req.params.item)})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error: "Could not delete the document"})
            })
        }else{
            res.status(500).json({error: "Not a valid Id"})
        }

        // data = data.filter( function(todo) {
        //      return todo.item.replace(/ /g, "-") !== req.params.item ;
        // });
        // res.json(data);
    });
    app.patch('/todo/:item', (req, res) => {
        const updates = req.body;
        if(ObjectId.isValid(req.params.item)){
            db.collection('tasks')
            .updateOne({_id: new ObjectId(req.params.item)}, {$set: updates})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error: "Could not update the document"+ err})
            })
        }else{
            res.status(500).json({error: "Not a valid Id"})
        }

    });

}