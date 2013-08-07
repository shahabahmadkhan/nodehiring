//Specifying Schema for User Collection

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;



var userSchema = new Schema({
    name:{type:String,required:true,trim:true},
    email: {type: String, required: true, trim: true, index: { unique: true } },
    password:{type: String, required: true},
    accountStatus:{type:String,require:true,trim:true},
    userStatus:{type:Number,required:true,default:0},
    userType:{type:String,require:true,trim:true,Default:'Student'},
    age:{type:Number,min:18,max:100},
    mobile:{type:Number},
    education:String,
    expYear:String,
    studentType:String,
    cvLink:{type:String,default:null},
    date_created : { type: Date, required: true, default: Date.now }});


module.exports = mongoose.model('User', userSchema);

////

/*

exports.list = function(req, res) {
    Thread.find(function(err, threads) {
        res.send(threads);
    });
}

// first locates a thread by title, then locates the replies by thread ID.
exports.show = (function(req, res) {
    Thread.findOne({title: req.params.title}, function(error, thread) {
        var posts = Post.find({thread: thread._id}, function(error, posts) {
            res.send([{thread: thread, posts: posts}]);
        });
    })
});




var tryLogin= function (email,pass, callback) {
    this.findOne({email: email,password:pass}, function (err, obj) {
        if (err) callback(null);
        else callback(obj);
    });
};


var createUser= function (UserData, callback) {
    this.findOne({email: UserData.email}, function (err, obj) {
        if (err) {
            console.log('DB Error while finding user');
            callback(null);
        }
        else {
            if (obj==null){
                UserData.save(function(err,callback){
                    if (err)
                        console.log('DB error while saving new user');
                    else
                        callback;

                })
            }
            else
                return obj;
        }
    });
};

var deleteUser= function (id, callback) {
    this.remove({email:id},function(err){
        if (err)
            console.log('Unable to delete user from DB');
        else
            callback;

    })

};
var editUser= function (UserData, callback) {
    this.findOne({email: UserData.email}, function (err, obj) {
        if (err) {
            console.log('DB Error while finding user');
            callback(null);
        }
        else {
            var condition={email:UserData.email},
                update = {
                    email:UserData.email,
                    password:UserData.password,
                    age:UserData.age,
                    mobile:UserData.mobile,
                    education:UserData.education,
                    studentType:UserData.studentType,
                    cvLink:UserData.cvLink
                },
                options={multi:false};

            UserData.update(condition,update,options,function(err,callback){
                if (err)
                    console.log('DB error while saving editing user');
                else
                    return callback;

            })

        }
    });
};

//exporting all functions

exports.tryLogin=tryLogin
exports.editUser=editUser;
exports.deleteUser=deleteUser;
exports.createUser=createUser;
*/
