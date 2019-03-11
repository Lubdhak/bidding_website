var fs = require('fs')

console.info("Setting up routes");


module.exports = function(myserver){

	myserver.use(function(req, res, next) {
		var auth_roles = req.headers['auth-roles'];
		var auth_id = req.headers['auth-id'];
		var tenant_id = req.headers['tenant-id'];
		var tenant_name = req.headers['tenant-name'];
		
		// console.log("Tenant: " + tenant_id);

		req.auth = {
			roles: auth_roles,
			userid: auth_id
		};
		
		// if (tenant_id) {
		// 	req.tenant = tenantSvc.get(tenant_id);
		// }
		req.tenantId = tenant_id;
		req.tenantName = tenant_name;
		next();
	});
	
	fs.readdirSync(__dirname + '/').forEach(function(file) {
		if (file.match(/\.js$/) !== null && file !== 'index.js') {
			var name = file.replace('.js', '');
			require('./' + name)(myserver);
		}
	});
	
	myserver.get("/ping", function(req,res) {
		res.send("OK");
	});

}