const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const { stringify } = require("nodemon/lib/utils");
const { required } = require("nodemon/lib/config");
const app = express();
var currentuser;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// routes for all the pages started
//route for home page
app.get("/", function(req,res){
   res.render("home");
});
//route for about page
app.get("/about",function(req,res){
   res.render("about");
});
//route for contact page
app.get("/contact",function(req,res){
   res.render("contact");
});
//route to booking page
app.get("/mybooking",function(req,res){
   res.render("mybooking");
});
//route for signin page
app.get("/signin",function(req,res){
   res.render("signin");
});
//route for signup page
app.get("/signup",function(req,res){
   res.render("signup");
});
//route for food page
app.get("/food",function(req,res){
   res.render("food");
});
//route for cancel page
app.get("/cancel",function(req,res){
   res.render("cancel");
});
// router for logged in window
app.get("/loggedin",function(req,res){
   res.render("logged",{user:currentuser});
});
// router setup for the final booking 
app.get("/book",function(req,res){
   res.render("book",{user:currentuser});
})

// routes for all the pages closed
// routes for our users also
app.get("/userbooking",function(req,res){
   res.render("userbooking",{user:currentuser});
})
app.get("/usercancel",function(req,res){
   res.render("usercontact",{user:currentuser});
})
app.get("/usercontact",function(req,res){
   res.render("usercontact",{user:currentuser});
})
app.get("/userfood",function(req,res){
   res.render("userfood",{user:currentuser});
})
// mongodb connection and its implemetation
// creating a connection request with local mongodb
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = {
       firstName:{ 
        type:String,
        trim:true,
        required:true          
       },
       lastName:{ 
         type:String,
         trim:true,
         required:true          
        },
        email:{
           type:String,
           trim:true,
           required:true
        },  
        passWord:{
           type:String,
           trim:true,
           required:true
        },
        cnf:{
           type:String,
           trim:true,
           required:true,
        }

}
// creating the model for userSchema
const Detail = mongoose.model("detail",userSchema);
var status = 404;
var userCredentials = [];
// handling the post request on the home route 

app.post("/",function(req,res){
   const from = req.body.from;
   const to = req.body.to;
   const cat =req.body.cat;
   
  //  console.log(from,to,cat);
})
// hadling the post request on the login page
app.post("/signin",function(req,res){

    const userName = req.body.Userid;
    const passWord = req.body.password;
    Detail.find({},function(err,foundItems){
       console.log(foundItems);
       if(err){
          console.log(err);
       }else{
           userCredentials = foundItems;       
      }   
   }) 
      
      userCredentials.forEach(element => {
             if(element.firstName===userName){
                if(element.passWord===passWord){
                    status =200;
                    currentuser = userName;
                }
             }
      });

      if(status ==200){
         res.render("logged",{user:userName});
      }else{
         res.redirect("/signin");
      }

   
})
// post request for signup page
app.post("/signup",(req,res)=>{
   const fname = req.body.firstName;
   const lname = req.body.lastName;
   const passWord = req.body.password;
   const confirmPassword = req.body.password2;
   const mailid = req.body.email;
    
   console.log(fname);
   console.log(lname);
   console.log(mailid);
   console.log(passWord);
   console.log(confirmPassword);

   // inserting first sort of data in out database
   if(fname==""||lname==""||passWord==""||confirmPassword==""||mailid==""){
      res.redirect("/signup");
   }else{
   const formDetails = new Detail({
   firstName:fname,
   lastName:lname,
   email:mailid,
   passWord:passWord,
   cnf:confirmPassword 
   });
   
   // console.log(formDetails.cnf);
   if(formDetails.passWord===formDetails.cnf){
   formDetails.save();
   res.redirect("/signin");}else{
   res.redirect("/signup");
   }
}
})

// post request for the book page
app.post("/book",(req,res)=>{
   console.log("i am been logged");
   res.render("book",{user:currentuser})
})

// post request for cancel page
app.post("/cancel",(req,res)=>{
                          
})

// post request for food page
app.post("/orders",(req,res)=>{
                          
})





// port listen
app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
