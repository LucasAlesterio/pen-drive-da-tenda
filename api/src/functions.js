require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
    createToken(id){
        var token = jwt.sign({ id:id }, process.env.SECRET, {
            expiresIn: "10h"
        });
        return token;
    },
    verifyToken(token){
        let id = "";
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err){
            console.log(err);
            return null;
        }
        id = decoded.id;
        }       
    );
    return id;
    }
}