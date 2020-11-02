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

        var _link = await Link.create({name,link,description,photograph,type,tag});

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
        var average = 0;
        if(link.rating){
            link.rating.map((score)=>{
                average += score.nStars;
            });
            average = average/link.rating.lenght;
            b['average'] = average;
        }
        b['token'] = token;
        return response.json(b);
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

}