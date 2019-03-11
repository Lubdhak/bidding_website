const responseSvc = require('../services/response')
const ObjectId = require('mongodb').ObjectId;



module.exports = function(myserver) {
    // add bid
    myserver.post('/bid',function(req,res){

        var auth_id = req.headers['auth-id'];
        if (!auth_id) return res.status(400).json({ "error": "no auth-id found"});
        
        var item_id = req.body.item_id;
        if (!item_id) return res.status(400).json({ "error": "no item_id found"});
        
        var bid_amount = req.body.bid_amount;
        if (!bid_amount) return res.status(400).json({ "error": "no bid_amount found"});
        
        var auction_id = req.body.auction_id;
        if (!auction_id) return res.status(400).json({ "error": "no auction_id found"});

        var highest_bid_amt = 0;
        var model = req.db.collection("bids");
        var query = {item_id:ObjectId(item_id)}
        var options = {"limit":1,"sort":{"bid_amount":-1}}
        
        model.findOne(query,options,function(err,result){
            if (err) return responseSvc.error(res,err);
    
            if (result){
                highest_bid_amt = result.bid_amount;
                if (highest_bid_amt >= bid_amount) {
                    return responseSvc.error(res,"current_highest is "+highest_bid_amt);
                }

            }

            var data = {
                posted_by:ObjectId(auth_id),
                item_id:ObjectId(item_id),
                auction_id:ObjectId(auction_id),
                bid_amount:bid_amount,
                timestamp:Date.now()
            }
            
            var model = req.db.collection("bids");
            var query = data;
            var projection = {}
    
            model.insertOne(query,function(err,result){
                if (err) return responseSvc.error(res,err);
                temp = {bid_id:result.ops[0]._id};
                if (bid_amount > highest_bid_amt) {
                    temp['info'] = "New Highest Bid !!"
                    console.log("new max bid amount")
                    var model = req.db.collection("items");
                    var query = {"_id":ObjectId(item_id)};
                    var update =   {
                        "$set": {
                            "auctioned.status": false,
                            "auctioned.highest_bid": bid_amount,
                            "auctioned.bid_id": ObjectId(temp.bid_id)
                        }    
                    }
                    model.findOneAndUpdate(query,update,function(err,result){
                        if (err) console.log(err)
                        if (result) console.log("success - Set max bid amount")
                    })
                }
                return responseSvc.success(res,temp);
                
            });






            

          

        })
        
    });
    // get all bids
    myserver.get('/bid',function(req,res){
        var auth_id = req.headers['auth-id'];
        if (!auth_id) return res.status(400).json({ "error": "no auth-id found"});
    
        var model = req.db.collection("bids")
        var query = {"posted_by":ObjectId(auth_id)}
        var projection = {}

        model.find(query,projection).toArray(function(err,result){
            if (err) return responseSvc.error(res,err);
            if (!result) return responseSvc.success(res,{"err":"No Result Found"});
            return responseSvc.success(res,result);
            
        });
    });
}
