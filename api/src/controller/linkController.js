const User = require('../models/users');
const Link = require('../models/links');

const {createToken, verifyToken} = require('../functions');


module.exports = {
    async addLink(request,response){
        var {name,link,description,photograph,type,tag} = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var _user = await User.findOne({_id:_id});

        var _link = await Link.create({name,link,description,photograph,type,tag,user:_user.id});

        _user.links.push(_link._id);
        _user.save();

        var token = createToken(_user.id);
        var {id,name,email,user,photograph,friends,favorites,links} = _user;
        //return response.json({id,name,email,user,photograph,friends,favorites,links,token});
        return response.json({user:{id,name,email,user,photograph,friends,favorites,links,token},link:_link});
    },

    async deleteLink(request,response){
        const {link} = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var _user = await User.findOne({_id:_id});

        if(_user.friends.indexOf(friend._id) !== -1){
            await Link.findByIdAndDelete({_id:link});
            _user.links.pop(link);
            _user.save();
            var token = createToken(_user.id);
            return response.json(_user,token);
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
        var token = createToken(_user.id);
        const link = await Link.findOne({_id:id});
        
        const a = JSON.stringify(link);
        var b = JSON.parse(a);
        // if indexOf == -1 no existe
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
        var average = 0;
        if(link.rating){
            link.rating.map((score)=>{
                average += score.nStars;
            });
        }
        average = average/link.rating.length;
        b['average'] = average;
        b['token'] = token;
        const userLink = await User.findOne({_id:link.user});
        return response.json({link:b,user:{id:userLink._id,photograph:userLink.photograph,user:userLink.user}});
    },

    async updateLink(request,response){
        const data = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        var _user = await User.findOne({_id:_id});
        if(_user.links.indexOf(data.id) !== -1){
            const _link = await Link.findOneAndUpdate({_id:data.id},data, {upsert: true}, function(err, doc) {
                if (err) return response.json({error:true,message:err});
            });
            const token = createToken(_id);
            return response.json({link:_link,token});
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
        // if indexOf == -1 no existe
        if(_user.favorites.indexOf(link) !== -1){
            _user.favorites.pop(link);
        }else{
            _user.favorites.push(link);
        }
        await _user.save();
        const {id,name,email,user,photograph,friends,favorites,links} = _user;
        const token = createToken(id);
        return response.json({id,name,email,user,photograph,friends,favorites,links,token});
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
        _link.save();
        return response.json(_link);
    },

    async searchLink(request,response){
        const {authorization} = request.headers;
        const {text,type} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const token = createToken(_id);
        var tag = '';
        var first = text.split('');
        if(first[0]==='#'){
            first.shift();
            first.map((word)=>{
                tag += word;
            });
            var arrayTags = text.split(/[ ,]+/);
            var array = [];
            arrayTags.map((a,i)=>{
                array.push(a.substr(1));
            });
            if(type && text){
                var links = await Link.find().select(['name','photograph','rating']).where('tag.name').in(array).where('type.name').equals(type).exec();
            }
            if(!type && text){
                var links = await Link.find().select(['name','photograph','rating']).where('tag.name').in(array).exec();
            }
            if(type && !text){
                var links = await Link.find().select(['name','photograph','rating']).where('type.name').equals(type).exec();
            }
            if(!type && !text){
                var links = await Link.find().select(['name','photograph','rating']).exec();
            }
            var average = 0;
            var a = [];
            var b = {};
            links.map((link)=>{
                b = JSON.parse(JSON.stringify(link));
                if(link.rating){
                    link.rating.map((score)=>{
                        average += score.nStars;
                    });
                }
                average = average/link.rating.length;
                b['average'] = average;
                a.push(b);
            });

            return response.json({link:a,token});
        }
        if(type && text){
            var links = await Link.find().select(['name','photograph','rating']).where('type.name').equals(type).where('name').in(text).exec();
        }
        if(!type && text){
            var links = await Link.find().select(['name','photograph','rating']).where('name').in(text).exec();
        }
        if(type && !text){
            var links = await Link.find().select(['name','photograph','rating']).where('type.name').equals(type).exec();
        }
        if(!type && !text){
            var links = await Link.find().select(['name','photograph','rating']).exec();
        }
        var average = 0;
        var a = [];
        var b = {};
        links.map((link)=>{
            b = JSON.parse(JSON.stringify(link));
            if(link.rating){
                link.rating.map((score)=>{
                    average += score.nStars;
                });
            }
            average = average/link.rating.length;
            b['average'] = average;
            a.push(b);
        });

        return response.json({link:a,token});
    

    }
}