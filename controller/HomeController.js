/**
 * Created with JetBrains WebStorm.
 * User: shahab
 * Date: 31/7/13
 * Time: 4:19 PM
 * To change this template use File | Settings | File Templates.
 */

var showPage=function(req,res){
    res.render('index.ejs');

}

exports.showPage=showPage;
