const responseSvc = require('../services/response')
const ObjectId = require('mongodb').ObjectId;



module.exports = function(myserver) {
    // get user by auth-id
    myserver.get('/users',function(req,res){
        var auth_id = req.headers['auth-id'];
        if (auth_id!="admin") return responseSvc.error(res,"no admin-id found");
    
        var model = req.db.collection("users")

        model.find({},{}).toArray(function(err,result){
            if (err) return responseSvc.error(res,err);
            if (!result) return responseSvc.success(res,{"err":"No Result Found"});
            return responseSvc.success(res,result);
            
        });
    });
    // add user
    myserver.post('/users',function(req,res){
        
        var data = req.body
        data['timestamp'] = Date.now()
  
        var model = req.db.collection("users");
        var query = data;
        var projection = {}
  
        model.insertOne(query,function(err,result){
            if (err) return responseSvc.error(res,err);
            temp = {auth_id:result.ops[0]._id};
            return responseSvc.success(res,temp);

        });
    });
}
