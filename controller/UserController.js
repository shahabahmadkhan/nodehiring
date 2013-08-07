/**
 * Created with JetBrains WebStorm.
 * User: shahab
 * Date: 31/7/13
 * Time: 4:19 PM
 * To change this template use File | Settings | File Templates.
 */
var UserModel = require('../model/User');
var UserService=require('../service/UserService');

var createUser=function(req,res){
    var Userdata={
        name:req.body.name,
        email:req.body.email,
        password:Math.random().toString(36).slice(-8),
        age:req.body.age,
        mobile:req.body.mobile,
        education:req.body.education,
        studentType:req.body.studentType,
        cvLink:null

    };
    UserModel.createUser(Userdata,function(err){
        console.log('Creation');
        if (err)
        {
        console.log('Error Creating User : I am in user controller'+ err);
        }
        else
        {
            res.send('Registered Successfully');
        console.log('Created Successfully');
        }

    })

}

exports.createUser=createUser;