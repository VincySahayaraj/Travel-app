
const express = require("express");
const session = require('express-session');
const cors = require("cors");
const mongoose = require("mongoose");
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

//app.use(session({ secret: 'travelshhhh', saveUninitialized: true, resave: true }));

app.use(
    session({
        secret: 'travelshhhh',
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: 6000000
        },
        value: 0
    })
);


// mongoose.connect("mongodb://localhost:27017/travelapp");()=>{
//     console.log("connected to DB");
// }

//Db connection
var url = "mongodb://0.0.0.0:27017/travelapp";
mongoose.connect(url, (err) => {
    if (!err) {
        console.log("DB connected successfully")
    }
    else {
        console.log("DB Error", err);
    }
})

var sess; // global session,

//user schema 
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    city: String,
    address: String,
})

const User = new mongoose.model("User", userSchema)

//routes routes
// app.post("/Login",(req,res)=>{
//     const {email,password} =req.body;
//     User.findOne({email:email},(err,user)=>{
//         if(user){
//            if(password === user.password){
//                res.send({message:"login sucess",user:user})
//                console.log("hjhjhj",user)
//            }else{
//                res.send({message:"wrong credentials"})
//            }
//         }else{
//             res.send("not register")
//         }
//     })
// });
// app.post("/Register",(req,res)=>{
//     console.log(req.body) 
//     const {name,email,password,role} =req.body;
//     User.findOne({email:email},(err,user)=>{
//         if(user){
//             res.send({message:"user already exist"})
//         }else {
//             const user = new User({name,email,password,role})
//             user.save(err=>{
//                 if(err){
//                     res.send(err)

//                 }else{
//                     res.send({message:"sucessfull"})
//                     // alert("user register successfully")
//                 }
//             })
//         }
//     })
// }) 

//Login
app.post("/Login", (req, res) => {
    //console.log("login funct")
    sess = req.session;
    const { email, password } = req.body;

    User.findOne({ email: email }, (err, user) => {
        if (user) {
            bcrypt.compare(password, user.password).then((status) => {
                if (status) {
                    sess.userId = user._id;
                    res.status = true;
                    res.send({ message: "login successfully", user: user })
                    //console.log("login succesfully")
                }
                else {
                    res.status = false
                    res.send({ message: "wrong credentials" })
                }
            })
        }
        else {
            res.send({ message: "User not registered" })
        }
    })
});


//Add User or register 
app.post("/register", (req, res) => {

    const { name, email, password, role, city, address } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {

            res.send({ message: "user already exist", isRegistered: false })
        }
        else {
            bcrypt.hash(password, 10)
                .then(hashedpassword => {
                    const user = new User({
                        name,
                        email,
                        password: hashedpassword,
                        role,
                        city,
                        address,
                    })
                    user.save(
                        res.send({ message: "Successfully Registered.", user: user, isRegistered: true })
                    )
                })
        }
    })
})

app.get('/users', (req, res) => {
    User.find({ role: { $ne: 'admin' } }).exec((err, users) => {

        if (err) {

            return res.status(400).json({
                success: false,
                error: err
            })

        }

        return res.status(200).json

            ({
                success: true,
                users: users
            })

    })
})



app.get('/userridehistory', (req, res) => {

    //console.log("Session User Id", sess);

    const userId = sess.userId;

    //const userId = "636dce21c9b7220aef7f4899";

    RideBook.find({
        adminApproveStatus: { $ne: 0 },
        userId: { $eq: userId },
        // rideStatus: { $ne: 2 }
    })
        // .populate('userId driverId')
        //.populate('driverId', 'name')
        .exec((err, rideBookings) => {

            if (err) {
                return res.status(400).json({
                    success: false,
                    error: err
                })
            }
            return res.status(200).json
                ({
                    success: true,
                    rideBookings: rideBookings
                })
        })
})

app.post('/drivers/:id', (req, res) => {

    //console.log("Session User Id", sess.userId);

    const place = req.params.id;

    User.find({ role: { $eq: 'CabDriver' }, city: { $eq: place } }).exec((err, users) => {

        if (err) {

            return res.status(400).json({
                success: false,
                error: err
            })
        }

        return res.status(200).json

            ({
                success: true,
                users: users
            })

    })
})

const rideBookSchema = new mongoose.Schema({
    //userId: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    //driverId: String,
    toLocation: String,
    rideStatus: Number,
    adminApproveStatus: Number,
    adminApproveDate: Date,
    rideStatusUpdatedBy: String,
    rideStatusUpdatedDate: Date,
    createdDate: Date,
    isReviewPost: Boolean,

})

const RideBook = new mongoose.model("BookRide", rideBookSchema);

app.post("/sendrequest", (req, res) => {

    const userId = sess.userId;

    const rideStatus = 0; //requested
    const adminApproveStatus = 0; //not approved
    const adminApproveDate = null; // by default null
    const rideStatusUpdatedBy = null;
    const rideStatusUpdatedDate = null;

    const { driverId, toLocation } = req.body;

    const rideBook = new RideBook({
        userId: userId,
        driverId: driverId,
        toLocation: toLocation,
        rideStatus: rideStatus,
        adminApproveStatus: adminApproveStatus,
        adminApproveDate: adminApproveDate,
        rideStatusUpdatedBy: rideStatusUpdatedBy,
        rideStatusUpdatedDate: rideStatusUpdatedDate,
        isReviewPost: false,
        createdDate: new Date(),
    })

    console.log("Ride Details", rideBook);

    rideBook.save(
        res.send({ message: "Request sent successfully" })
    )

})

app.get('/adminpendingrequests', (req, res) => {

    RideBook.find({ adminApproveStatus: { $eq: 0 } }).exec((err, rideBookings) => {

        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        return res.status(200).json
            ({
                success: true,
                rideBookings: rideBookings
            })

    })
})

app.post("/adminRequestAction", (req, res) => {

    //const userId = sess.userId;

    //console.log("Object Content", req.body);

    RideBook.findByIdAndUpdate(req.body._id, {
        adminApproveStatus: req.body.type,
        adminApproveDate: new Date()
    },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.body.type == 1) {
                    res.status(200).json({
                        message: "Successfully Updated",
                        success: 'true'
                    })
                }
                else if (req.body.type == 2) {
                    //sendNotification("Your request for driver " + objectId.driverId +  " for going to " + objectId.toLocation + " has been Rejected by Admin", objectId.userId);
                    res.status(200).json({
                        message: "Successfully Updated",
                        success: 'true'
                    })
                }
            }
        });

    // RideBook.findByIdAndUpdate(req.body._id, {

    //     $set: {
    //         adminApproveStatus: req.body.type,
    //         adminApproveDate: new Date()
    //     }
    // });

    // if (req.body.type == 1) {
    //     res.status(200).json({
    //         message: "Successfully Updated",
    //         success: 'true'
    //     })
    // }
    // else if (req.body.type == 2) {
    //     //sendNotification("Your request for driver " + objectId.driverId +  " for going to " + objectId.toLocation + " has been Rejected by Admin", objectId.userId);
    //     res.status(200).json({
    //         message: "Successfully Updated",
    //         success: 'true'
    //     })
    // }

})

app.get('/driverpendingrequests', (req, res) => {

    //console.log("Session User Id", sess);

    const userId = sess.userId;

    RideBook.find({
        adminApproveStatus: { $eq: 1 },
        driverId: { $eq: userId },
        //rideStatus: { $ne: 2 }
    })
        // .populate('userId driverId')
        //.populate('driverId', 'name')
        .exec((err, rideBookings) => {

            if (err) {
                return res.status(400).json({
                    success: false,
                    error: err
                })
            }

            return res.status(200).json
                ({
                    success: true,
                    rideBookings: rideBookings
                })

        })
})

app.post("/driverRequestAction", (req, res) => {

    const userId = sess.userId;

    //console.log("Object Content", req.body);

    RideBook.findByIdAndUpdate(req.body._id, {
        rideStatus: req.body.type,
        rideStatusUpdatedBy: userId,
        rideStatusUpdatedDate: new Date()
    },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.body.type == 1) {
                    res.status(200).json({
                        message: "Successfully Updated",
                        success: 'true'
                    })
                }
                else if (req.body.type == 2) {
                    //sendNotification("Your request for driver " + objectId.driverId +  " for going to " + objectId.toLocation + " has been Rejected by Admin", objectId.userId);
                    res.status(200).json({
                        message: "Successfully Updated",
                        success: 'true'
                    })
                }
            }
        });

})


// review 

//user schema 
const reviewschema = new mongoose.Schema({
    name: String,
    comments: String,
    trackId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'RideBook'
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },

})

const Review = new mongoose.model("Review", reviewschema)

//Add User or register 
app.post("/postreview", (req, res) => {

    const { name, comments, trackId, driverId } = req.body;

    const reviewpost = new Review({
        name,
        comments,
        trackId,
        driverId,
    })

    console.log("Ride Review", reviewpost);

    reviewpost.save(

        RideBook.findByIdAndUpdate(req.body.trackId, {
            isReviewPost: true
        },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                res.send({ message: "successfully posted" })
            }
        })
    )
})

//get the reviews
app.get("/userreviews", (req, res) => {

    Review.find({

        //rideStatus: { $ne: 2 }
    })
    .populate('driverId')
    .exec((err, reviewpost) => 
    {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }
        return res.status(200).json
        ({
            success: true,
            reviewpost: reviewpost
        })
    })
})


app.get('/adminhistory', (req, res) => {

    //console.log("Session User Id", sess);

    const userId = sess.userId;

    //const userId = "636dce21c9b7220aef7f4899";

    RideBook.find({
        // adminApproveStatus: { $ne: 0 },
        // userId: { $eq: userId },
        // rideStatus: { $ne: 2 }
    })
        // .populate('userId driverId')
        //.populate('driverId', 'name')
        .exec((err, rideBookings) => {

            if (err) {
                return res.status(400).json({
                    success: false,
                    error: err
                })
            }
            return res.status(200).json
                ({
                    success: true,
                    rideBookings: rideBookings
                })
        })
})


app.listen(6969, () => {
    console.log("started")
})