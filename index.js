const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash");
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

mongoose.set('strictQuery', false);

mongoose.connect(process.env.URL,{useNewUrlParser: true } ,() => {
    console.log("mongodb connected!")
});

const todoSchema = {
    name: String
}
const Item = mongoose.model("Item", todoSchema);

const item1 = new Item({
    name: "chal beta"
})
const item2 = new Item({
    name: "selfi lele"
})
const item3 = new Item({
    name: "reeeeeeeee"
})

const listSchema = {
    name : String,
    items : [todoSchema]
};

const List = mongoose.model("List", listSchema);

const defaultItems = [item1, item2, item3]



app.get("/", (req, res) => {

    Item.find({}, (err, foundItems) => {
        if (foundItems === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("default data inserted successfully in db")
                }
            })
            res.redirect("/" + customListName);
        }
        else {
            res.render("list", { heading: "Today", newItems: foundItems });
        }
    })
})

app.get('/:customListName', (req,res)=>{
    const customListName = _.capitalize(req.params.customListName);

    
    List.findOne({name : customListName} , (err , foundList)=>{
        if(!err){
           if(!foundList){
            //    console.log("doesn't exist")
            const list = new List({
                name : customListName,
                items : defaultItems
            })
               list.save();
               res.redirect("/");
           }
           else{
            res.render("list" , {heading: foundList.name, newItems: foundList.items})
           }
        }
    })

})
app.post('/', (req, res) => {
    const itemName = req.body.newItem;
    const heading = req.body.heading;

    const newItem = new Item({
        name : itemName
    })
    if(heading === 'Today'){
        newItem.save();
        res.redirect('/');
    }
    else{
        List.findOne({name : heading}, (err, foundList)=>{
            if(err){
                console.log(err)
            }
            else{

                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" +heading);
            }
            })
    }
})

app.post('/delete', (req,res)=>{
    const checkItemId = req.body.checkbox;
    const listName = req.body.listName;


    if(listName === "Today"){
        Item.findByIdAndRemove(checkItemId, (err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log("item deleted!")
                res.redirect('/');
            }
        })
    }
    else{
        List.findOneAndUpdate({name : ListName}, {$pull :{items: {_id: checkItemId}}}, (err, foundList)=>{
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }
    })
app.get('/work', (req, res) => {
    res.render("list", { heading: "Work", newItems: workItems });
})
app.listen(process.env.PORT || 3000, () => {
    console.log("server on running 3000!");
})