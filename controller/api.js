var User = require('../model/User.js');
var nodemailer = require("nodemailer");
var crypto = require('crypto');

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq');
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text){
    console.log('decrypting'+text);
    var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq');
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}


//Creating Default Admin User
exports.initDB=function(){
    console.log('Ini');
        var email="nodehiring@gmail.com";
    User.findOne({email:email},function(err,data){
        if (err)
        {
            res.send('error');
            console.log('error while finding user'+err);
        }
        else
        {
            if (data==null)
                {    new User({
                    name:"Shahab Ahmad Khan",
                    email:"nodehiring@gmail.com",
                    password:crypto.createHash('sha1').update("igdefault").digest("hex"),
                    accountStatus:"Activated",
                    userStatus:1,
                    userType:"Administrator",
                    age:"24",
                    mobile:"8287494252",
                    education:null,
                    studentType:null
                }).save(function(err){
                        if (err)
                        {
                            console.log('Error Creating User : '+ err);
                        }
                        else
                        {
                            console.log('Admin Created Successfully');
                        }

                });
            }
            else
            console.log('Admin Already Exists..');
        }



});
}

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "nodehiring@gmail.com",
        pass: "igdefault"
    }
});

exports.loginUser=function(req,res){
    var cryptedPass=crypto.createHash('sha1').update(req.body.password).digest("hex");
    User.findOne({email:req.body.email,password:cryptedPass},function(err,data){
        if (err)
        {
            res.send('error');
        console.log('error while finding user'+err);
        }
        else
        {
            if (data==null)
            {
                res.send('error');
                console.log('error while finding user'+err);
            }
            else
            {
                req.session.UserName=data.name;
                req.session.UserSession=data._id;
                req.session.UserType=data.userType;
                res.send(data);
            }

        }
    });


}

exports.checkUserSession=function(req,res){
    if (req.session.UserSession)
    {
        User.findOne({_id:req.session.UserSession},{password:0},function(err,data){
            console.log(data);
            res.send(data);

        });


    }
    else
    {
        res.send('invalid');
    }

}

exports.activateUser=function(req,res){
    var email=decrypt(req.body.email);
    User.findOne({email:email},function(err,data){
        //If error while finding user i.e. database error
        if (err)
        {
            res.send('error');
        }
        else //if query successful
        {
            if (data==null)  //if no such email found
            {
                res.send('notFound');
            }
            else //if email found
            {
               if (data.accountStatus=='Registered')
               {
                   var cryptedPass=crypto.createHash('sha1').update(req.body.password).digest("hex");
                   User.update({email:data.email},{password:cryptedPass,accountStatus:'Activated',userStatus:1},function(err,data){
                       if (err)
                       {
                           res.send('error');
                       }
                       else
                       {
                           res.send('success');
                       }

                   });

               }
                else
               {
                   res.send('Activated');
               }
            }

        }
    });


}


exports.getActivateUser=function(req,res){
    var email=decrypt(req.body.email);
    User.findOne({email:email},function(err,data){
        //If error while finding user i.e. database error
        if (err)
        {
            res.send('error');
            console.log('error while finding user'+err);
        }
        else //if query successful
        {
            console.log(data);
            if (data==null)  //if no such email found
            {
                res.send('notFound');
            }
            else //if email found
            {
                if (data.accountStatus=='Activated') //if already activated
                {
                    res.send('Activated');
                }
                else// if not activated then show form to activate it
                {
                    res.send(data)

                }
            }

        }
    });


}

exports.forgotPassword=function(req,res){

    User.findOne({email:req.body.email},function(err,data){
        console.log(data);
        if (err)
        {


                res.send('error');
            console.log('error while finding user'+err);
        }
        else if (data!=null)
        {
            var newPassword=Math.random().toString(36).slice(-8);
            var cryptedPass=crypto.createHash('sha1').update(newPassword).digest("hex");

            User.update({email:data.email},{password:cryptedPass},function(err,datas){
                if (err)
                {
                    console.log('Error while updating new password');
                    res.send('error');
                }
                else
                {
                    //Sending new passsword to user via email
                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: "Node Hiring <nodehiring@gmail.com>", // sender address
                        to: data.email, // list of receivers
                        subject: "NodeHiring - Intelligrape Password Recovery", // Subject line
                        html: "Dear <b>"+data.name+"</b>,<br><br> Your new password is :"+newPassword+"<br>You can now try to login at URL: http://localhost:8080/#/login \n\n Regards,\n Intelligrape " +
                            "Software Private Limited\nSDF L-6 , NSEZ, Noida"
                    };

                    // send mail with defined transport object
                    smtpTransport.sendMail(mailOptions, function(error, response){
                        if(error){
                            console.log(error);
                        }else{
                            console.log("Message sent: " + response.message);
                            res.send('success');
                            console.log('New Password Sent');
                        }

                    });


                    console.log('New Password Set');
                    res.send('success');
                }

            });

            res.send('success');
            console.log(data);
        }
        else
        {
            res.send('error');
            console.log('User Not Found');
        }
    });


}



exports.createUser = function(req, res) {
//    var encrypted = cipher.update(email, 'utf8', 'hex') + cipher.final('hex');
//    var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')

    var UserData={
        name:req.body.name,
        email:req.body.email,
        encrLink:"http://localhost:8080/#activate/"+encrypt(req.body.email),
        age:req.body.age,
        mobile:req.body.mobile,
        education:req.body.education,
        studentType:req.body.studentType,
        resumeFile:req.body.file,
        userType:'User',
        cvLink:null

    };

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Node Hiring <nodehiring@gmail.com>", // sender address
        to: UserData.email, // list of receivers
        subject: "Welcome Mail From NodeHiring at Intelligrape", // Subject line
        html: "Dear <b>"+UserData.name+"</b>,<br><br>We have received your application.<br>You are now required to activate your account by clicking the link below <br> "+UserData.encrLink+"<br><br>Regards,<br>Intelligrape " +
            "Software Private Limited<br>SDF L-6 , NSEZ, Noida" // plaintext body
    };



    new User({
        name:UserData.name,
        email:UserData.email,
        password:"321321",
        accountStatus:"Registered",
        age:UserData.age,
        mobile:UserData.mobile,
        education:UserData.education,
        studentType:UserData.studentType,
        userType:UserData.userType,
        cvLink:UserData.cvLink
    }).save(function(err){
            console.log('Creation');
            if (err)
            {
                console.log('Error Creating User : I am in user controller'+ err);
                res.send('error');
            }
            else
            {
                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                        res.send('success');
                        console.log('Created Successfully');
                    }

                    // if you don't want to use this transport object anymore, uncomment following line
                    //smtpTransport.close(); // shut down the connection pool, no more messages
                });


            }

        });
}


exports.updateProfile = function(req, res) {

   //Common data for all
    var UserData={
        name:req.body.name,
        email:req.body.email,
        age:req.body.age,
        mobile:req.body.mobile
    }

    //Selective Data
    if (req.body.password)
    UserData.password=req.body.password;

    if (req.body.education)
    UserData.education=req.body.education;

    if (req.body.studentType)
    UserData.studentType=req.studentType;

    if (req.body.expYear)
    UserData.expYear=req.body.expYear;

    if (req.body.userType)
    UserData.userType=req.body.userType;

    if (req.body.userStatus)
    UserData.userStatus=req.body.userStatus;

    if (req.body.accountStatus)
    UserData.accountStatus=req.body.accountStatus;

    //Whom To Update?
    if (req.body.target!='self')
        targetId=req.body.target;
    else
        targetId=req.session.UserSession;


    //Update Process Starts


    User.update({_id:targetId},UserData,function(err,data){

        if (err)
        {
            res.send('error');
        }
        else
        {
            res.send('success');
        }

    });





}



exports.logoutUser=function(req,res){
    if (req.session) {
        req.session.UserSession = null;
        req.session.UserType=null;
        req.session.destroy(function() {});
    }
    res.send('loggedOut');

}