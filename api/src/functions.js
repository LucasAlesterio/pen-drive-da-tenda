require("dotenv-safe").config();
var fs = require("fs");
const jwt = require('jsonwebtoken');
const gc = require('./cloud');
const bucket = gc.bucket('twm-images');

module.exports = {
    createToken(id){
        var token = jwt.sign({ id:id }, process.env.SECRET, {
            expiresIn: "10h"
        });
        return token;
    },
    verifyToken(token){
        let id = "";
        //var e = "";
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if(err){
            //
            if(err.name == 'TokenExpiredError'){
                //console.log(err.name);
                return('expired')
            }
            return null;
        }
        //id = err.name
        id = decoded.id;

        }       
    );
    return id;
    },
    decodeBase64Image(image,name) {
        let base64Image = image.split(';base64,').pop();
            fs.writeFile(`src/temp/${name}.png`, base64Image, {encoding: 'base64'}, function(err) {
                return true;
            });
        return false;
    },
    deleteFile(name){
        try {
            fs.unlinkSync(`src/temp/${name}.png`);
            return true;
        } catch(err) {
            return false;
        }
        
    },
    async uploadImage(name){
        const res = await gc.bucket('twm-images').upload(`./src/temp/${name}.png`);
        const url = res[0].metadata.mediaLink;
        return url;
    },
    async deleteImage(id){
        await bucket.file(`${id}.png`).delete().then(()=>{
            return true
        });
        return false;
    }
}