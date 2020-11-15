const User = require('../models/users');
const Link = require('../models/links');

const {createToken, verifyToken,decodeBase64Image,deleteFile,uploadImage, deleteImage} = require('../functions');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async addLink(request,response){
        var {name,link,description,photograph,type,tag} = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var idGerado = null;
        var _user = await User.findOne({_id:_id});
        if(photograph){
            idGerado = uuidv4();
            await decodeBase64Image(photograph,idGerado);
            const url = await uploadImage(idGerado);
            if(url){
                deleteFile(idGerado);
            }
            else{
                err.error = true;
                err.photo = true;
            }
            photograph = `https://storage.googleapis.com/twm-images/${idGerado}.png`;
        }
        var _link = await Link.create({name,link,description,photograph,type,tag,user:_user.id,idImg:idGerado});
        _user.links.push(_link._id);
        _user.save();
        return response.json({id:_link._id});
    },

    async deleteLink(request,response){
        const {link} = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var _user = await User.findOne({_id:_id});
        if(_user.links.indexOf(link) !== -1){
            const _link = await Link.findOne({_id:link});
            if(_link.photograph){
                await deleteImage(_link.idImg);
            }
            await Link.findByIdAndDelete({_id:link});
            _user.links.map((f,index)=>{
                if(f === link){
                    _user.links.splice(index,1);
                }
            })
            _user.save();
            return response.send(true);
        }
        return response.json({error:true,authorization:true});
    },

    async dataLink(request,response){
        const {id} = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var _user = await User.findOne({_id:_id});
        const link = await Link.findOne({_id:id});
        const a = JSON.stringify(link);
        var b = JSON.parse(a);
        if(_user.links.indexOf(id) !== -1){
            b['isMy'] = true;
        }else{
            b['isMy'] = false;
        }
        if(_user.favorites.indexOf(id) !== -1){
            b['isFavorite'] = true;
        }else{
            b['isFavorite'] = false;
        }
        const userLink = await User.findOne({_id:link.user});
        return response.json({link:b,user:{id:userLink._id,photograph:userLink.photograph,user:userLink.user}});
    },

    async updateLink(request,response){
        var data = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var idGerado = null;
        var _link = await Link.findOne({_id:data.id});
        if(data.photograph && data.photograph != _link.photograph){
            if(_link.photograph){
                await deleteImage(_link.idImg);
            }
            idGerado = uuidv4();
            await decodeBase64Image(data.photograph,idGerado);
            const url = await uploadImage(idGerado);
            if(url){
                deleteFile(idGerado);
            }
            else{
                err.error = true;
                err.photo = true;
            }
            data.photograph = `https://storage.googleapis.com/twm-images/${idGerado}.png`;
            data.idImg = idGerado;
        }
        var _user = await User.findOne({_id:_id});
        if(_user.links.indexOf(data.id) !== -1){
            await Link.findOneAndUpdate({_id:data.id},data, {upsert: true}, function(err, doc) {
                if (err) return response.json({error:true,message:err});
            });
            return response.status(200).send('Ok!');
        }
        return response.json({error:true,authorization:true});
    },

    async updateFavorite(request,response){
        const {authorization} = request.headers;
        const {link} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        if(_user.favorites.indexOf(link) !== -1){
            _user.favorites.map((f,index)=>{
                if(f === link){
                    _user.favorites.splice(index,1);
                }
            })
        }else{
            _user.favorites.push(link);
        }
        await _user.save();
        return response.status(200).send('Ok!');
    },

    async rating(request,response){
        const {authorization} = request.headers;
        const {link,stars} = request.body;
        var flag = false;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        let _link = await Link.findOne({_id:link});
        _link.rating.map((rat)=>{
            if(rat.user === _id){
                flag = true;
                rat.nStars = stars;
            }
        });
        if(!flag){
            _link.rating.push({user:_id,nStars:stars});
        }
        average = 0;
        _link.rating.map((score)=>{
            average += score.nStars;
        });
        average = average/_link.rating.length;
        _link.average = average;
        //console.log(average);
        _link.save();
        //return response.json(_link);
        return response.status(200).send('Ok!');
    },

    async searchLink(request,response){
        const {authorization} = request.headers;
        const {text} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        if(text){
            const resp = await Link.aggregate([
                {
                    '$search': {
                        'search': {
                        'path': [
                            'name', 'description', 'tag.name','type.name'
                        ], 
                        'query': text
                        }
                    }
                    }, {
                    '$project': {
                        'name': 1, 
                        'photograph': 1, 
                        '_id': 1, 
                        'average': 1
                    }
                }
            ]);
            return response.json(resp);
        }else{
            var links = await Link.find().select(['name','photograph','average']).exec();
            return response.json(links);
        }
    },
    async timeline(request,response){
        const {authorization} = request.headers;
        let _id = '';
        _id = await verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        var links = await Link.find().select(['name','photograph','average','user']).where('user').in(_user.friends).exec();
        links = JSON.parse(JSON.stringify(links));
        var idusers = links.map((link)=>{
            return link.user;
        });
        var usuario = await User.find().select(['user','photograph','name']).where('_id').in(idusers);
        const resp = links.map((link)=>{
            usuario.map((us)=>{
                if(link.user == us._id){
                    link['user'] = us;
                }
            })
            return(link);
        });
        return response.json({link:resp});
    },

    async types(request,response){
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var links = await Link.find().select('type.name');
        var a = [];
        links.map((link)=>{
            if(a.indexOf(link.type.name) === -1){
                a.push(link.type.name);
            }
        });
        return response.json({types:a});
    }
}