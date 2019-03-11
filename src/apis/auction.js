const responseSvc = require('../services/response')
const ObjectId = require('mongodb').ObjectId;



module.exports = function(myserver) {
    // upcoming & Previous auctions
    myserver.get('/auction/:type',function(req,res){
        // type = upcoming
        // type = previous

        var type = req.params.type;
        if (!['upcoming','previous'].includes(type)) return responseSvc.error(res,"incorrect param");

        var model = req.db.collection("auctions");
        var query = {};
        var projection = {};

        if (type == "previous"){
            query = {"end_datetime":{"$lt":new Date()}}

        }
        if (type == "upcoming"){
            query = {"start_datetime":{"$gte":new Date()}}
        }


        
        if (query){

            model.findOne(query,projection,function(err,result){
                if (err) return responseSvc.error(res,err);
                if (!result) return responseSvc.success(res,{"err":"No Result Found"});
                return responseSvc.success(res,result);
            });

        }

        
    });

    // create an auction by admin
    myserver.post('/auction',function(req,res){
        var auth_id = req.headers['auth-id'];
        if (auth_id!='admin') return res.status(400).json({ "error": "no admin-id found"});
        
        var item_ids = req.body.item_ids
        if (!Array.isArray(item_ids)) return res.status(400).json({ "error": "no item_ids array found"});

        var data = req.body
        data['start_datetime'] = new Date(data["start_datetime"]);
        data['end_datetime'] = new Date(data["end_datetime"]);
        data['posted_by'] = auth_id;
        // data['item_ids'] = ObjectId(data['item_id']);
        data['created_at'] = Date.now();
        console.log(data);

        var model = req.db.collection("auctions");
        var query = data;
        var projection = {}

        model.insertOne(query,function(err,result){
            if (err) return responseSvc.error(res,err);
            return responseSvc.success(res,{"auction_id":result.ops[0]._id});
            
        });
    });

    // list all items in an auction
    myserver.get('/auction_items/:auction_id',function(req,res){
        var auth_id = req.headers['auth-id'];
        if (!auth_id) return res.status(400).json({ "error": "no auth_id found"});
        
        var auction_id = req.params.auction_id;
        if (!auction_id) return res.status(400).json({ "error": "no auction_id found"});
        

        var model = req.db.collection("auctions")
        var query = {"_id":ObjectId(auction_id)};
        var projection = {};


        // model.find(query,projection).toArray(function(err,docs){

        model.findOne(query,projection,function(err,docs){

            if (err) return responseSvc.error(res,err);
            if (!docs) return responseSvc.success(res,[]);
            var item_ids = docs.item_ids

            // item_ids = ['5c83b32290c1127991e0fd70','5c84b962f48809f15b50ef30']
            console.log(item_ids);
            var item_ids = item_ids.map(function(id) { return ObjectId(id); });
            var model = req.db.collection("items")
            var query =  { _id : { $in : item_ids } }
            // console.log(query)
            model.find(query,projection).toArray(function(err,docs){
                if (err) return responseSvc.error(res,err);
                if (!docs) return responseSvc.success(res,[]);
                return responseSvc.success(res,docs);
            });
               
        });

        
    });
}
