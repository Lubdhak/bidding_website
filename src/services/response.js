
var sendSuccess = function(res, data) {
	res.send(data);
}

var sendError = function(res, err) {
	if (typeof err === "string")
		res.status(400).json({error: err});
	else
		unexpectedError(res, err);
}

var unAuthorized = function(res) {
	res.status(401).send("Unauthorized");	
}

var badRequest = function(res) {
	res.status(400).send("Bad Request");	
}

var missingParameter = function(res, name) {
	res.status(400).send({error: "Missing Parameter (" + name + ")" });	
}

var unexpectedError = function(res, err) {
	console.log(err);
	res.status(400).send({error: "An unexpected error occurred" });		
}

var invalidParameter = function(res, name) {
	res.status(400).send({error: "Invalid Parameter (" + name + ")" });
}

module.exports = {
	success: sendSuccess,
	error: sendError,
	missingParameter: missingParameter,
	unexpectedError: unexpectedError,
	invalidParameter: invalidParameter,
	unAuthorized: unAuthorized,
	badRequest: badRequest
}