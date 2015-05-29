var mongoose = require("mongoose"),
							  bcrypt = require("bcrypt"),
								salt = bcrypt.genSaltSync(10);

var userSchema = new mongoose.Schema({
								 // first, last, email, password
								 // clients > jobs > sessions, start, stop, date
								 email: {
												 	type: String,
												 	required: true,
												 	lowercase: true,
												 	index: {
												 						unique: true
												 				 }
											 	}, 
								 passwordDigest: {
																 		type: String,
																 		required: true
								 								 },
								 name: {
											 		first: {
											 							type: String,
											 							required: true
											 		},
									 	  		last: {
												 	  			type: String,
												 	  			required: true
									 	  		}
											 }
								});

userSchema.statics.createSecure = function (email, password, first, last, cb) {
	var that = this;
	// hash the password
	bcrypt.genSalt(function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {
			that.create({
				email: email,
				passwordDigest: hash,
				name: {
					first: first,
					last: last
				}
			}, cb);
		});
	});
};

userSchema.statics.encryptPassword = function (password) {
	var hash = bcrypt.hashSync(password, salt);
	return hash;
};

userSchema.methods.checkPassword = function (password) {
	return bcrypt.compareSync(password, this.passwordDigest);
};

userSchema.statics.authenticate = function(email, password, cb) {
	this.findOne({
		email: email
	},
	function(err, user){
		if (user === null){
			console.log("Username not found");
		} else if (user.checkPassword(password)){
			cb(null, user);
		}
	});
};

// userSchema.statics.createClient = function (userId) {
// 	var id = user._id;

// 	db.Client.create

// 	})
// }



var User = mongoose.model("User", userSchema);

module.exports = User;

