const responseSvc = require('../services/response')
const ObjectId = require('mongodb').ObjectId;



module.exports = function(myserver) {
    // add item
   myserver.post('/add_item',function(req,res){
      
    var auth_id = req.headers['auth-id'];
    if (!auth_id) return res.status(400).json({ "error": "no admin-id found"});

    if (!req.body.item_description) return res.status(400).json({ "error": "no item_description found"});

    if (!req.body.item_description.image_url) return res.status(400).json({ "error": "no item_description.image_url found"});


      var data = req.body
      data['timestamp'] = Date.now()
      data['posted_by'] = ObjectId(auth_id);
      console.log(data);

      var model = req.db.collection("items");
      var query = data;
      var projection = {}

      model.insertOne(query,function(err,result){
          if (err) return responseSvc.error(res,err);
          temp = {item_id:result.ops[0]._id};
          return responseSvc.success(res,temp);
          
      });
   });

   myserver.get('/get_item/:item_id',function(req,res){
      
    // var auth_id = req.headers['auth-id'];
    // if (!auth_id) return res.status(400).json({ "error": "no admin-id found"});
    var item_id = req.params.item_id;
    if (!item_id) return res.status(400).json({ "error": "no item_id found"});      

      var model = req.db.collection("items");
      var query = {_id:ObjectId(item_id)};
      var projection = {}

      model.findOne(query,function(err,result){
          if (err) return responseSvc.error(res,err);
          return responseSvc.success(res,result);
          
      });
   });
}
