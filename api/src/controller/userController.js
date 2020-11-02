const User = require('../models/users');
const {createToken, verifyToken} = require('../functions');
//const { json } = require('body-parser');

module.exports = {
    async addUser(request,response){
        var {name,email,password,user,photograph} = request.body;
        let err = {"error":false,"email":false,"user":false};
        let _user = await User.findOne({user});
        let _email = await User.findOne({email});
        if(_user){
            err.error = true;
            err.user = true;
        }
        if(_email){
            err.error = true;
            err.email = true;
        }
        if(!_user && !_email){
            _user = await User.create({name,email,password,user,photograph});
            var token = createToken(_user.id);
            var {id,name,email,user,photograph,friends,favorites,links} = _user;
            return response.json({id,name,email,user,photograph,friends,favorites,links,token});
        }else{
            return response.json(err);
        }
    },

    async login(request,response){
        var {user,email,password} = request.body;
        let err = {"error":false,"email":false,"password":false};
        let _user = {};
        if(user){
            _user = await  User.findOne({user});
            if(_user){
                if(_user.password === password){
                    var token = createToken(_user.id);
                    var {id,name,email,user,photograph,friends,favorites,links} = _user;
                    return response.json({id,name,email,user,photograph,friends,favorites,links,token});
                }else{
                    err.error = true;
                    err.password = true;
                }
            }
        }if(email){
            _user = await  User.findOne({email});
            if(_user){
                if(_user.password === password){
                    var token = createToken(_user.id);
                    var {id,name,email,user,photograph,friends,favorites,links} = _user;
                    return response.json({id,name,email,user,photograph,friends,favorites,links,token});
                }else{
                    err.error = true;
                    err.password = true;
                }
            }
        }if(!user){
            err.error = true;
            err.email = true;
        }
        return response.json(err);
    },

    async dataUser(request,response){
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        const {id,name,email,user,photograph,friends,favorites,links} = _user;
        const token = createToken(id);
        return response.json({id,name,email,user,photograph,friends,favorites,links,token});
    },

    async updateFriend(request,response){
        const {authorization} = request.headers;
        const {friend} = request.body;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        // if indexOf == -1 no existe
        if(_user.friends.indexOf(friend) !== -1){
            _user.friends.pop(friend);
        }else{
            _user.friends.push(friend);
        }
        await _user.save();
        const {id,name,email,user,photograph,friends,favorites,links} = _user;
        const token = createToken(id);
        return response.json({id,name,email,user,photograph,friends,favorites,links,token});
    },
    async updatePassword(request,response){
        const {oldPassword,newPassword} = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:_id});
        if(_user.password === oldPassword){
            _user.password = newPassword;
            await _user.save();
            const {id,name,email,user,photograph,friends,favorites,links} = _user;
            const token = createToken(id);
            return response.json({id,name,email,user,photograph,friends,favorites,links,token});
        }else{
            return response.json({error:true,password:true});
        }
    },
    async updateProfile(request,response){
        const data = request.body;
        const {authorization} = request.headers;
        let _id = verifyToken(authorization);
        if(!_id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOneAndUpdate({_id:_id},data, {upsert: true}, function(err, doc) {
            if (err) return response.json({error:true,message:err});
        });
        const {id,name,email,user,photograph,friends,favorites,links} = _user;
        const token = createToken(id);
        return response.json({id,name,email,user,photograph,friends,favorites,links,token});
    },

    async listFriends(request,response){
        const {authorization} = request.headers;
        let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:id});
        const list = await User.find().select(['user','name','photograph']).where('_id').in(_user.friends).exec();
        return response.json(list);
    },
    
    async findUser(request,response){
        const {authorization} = request.headers;
        const {search} = request.body;
        let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:id});
        var list = await User.find().select(['user','name','photograph']).where('user').in(search).exec();
        const a = JSON.stringify(list);
        var b = JSON.parse(a);
        // if indexOf == -1 no existe
        b.map((friend,index)=>{
            if(_user.friends.indexOf(friend._id) !== -1){
                b[index]['isFriend'] = true;
            }else{
                b[index]['isFriend'] = false;
            }
        });
        return response.json(b);
    }
}
