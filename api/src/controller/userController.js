const User = require('../models/users');
const {createToken, verifyToken} = require('../functions');

module.exports = {
    async addUser(request,response){
        const {name,email,password,user,photograph} = request.body;
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
            _user = await User.create({
                name,
                email,
                password,
                user,
                photograph
            });
            var token = createToken(_user.id);
            return response.json({user:_user,token:token});
        }else{
            return response.json(err);
        }
    }
    ,
    async login(request,response){
        const {user,email,password} = request.body;
        let err = {"error":false,"email":false,"password":false};
        let _user = {};
        if(user){
            _user = await  User.findOne({user});
            if(_user){
                if(_user.password === password){
                    err.error = true;
                    err.password = true;
                    var token = createToken(_user.id);
                    return response.json({user:_user,token:token});
                }
            }
        }if(email){
            _user = await  User.findOne({email});
            if(_user){
                if(_user.password === password){
                    err.error = true;
                    err.password = true;
                    var token = createToken(_user.id);
                    return response.json({user:_user,token:token});
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
        let id = verifyToken(authorization);
        if(!id){
            return response.json({error:true,token:true});
        }
        const _user = await User.findOne({_id:id});
        const {name,email,user,photograph,friends,favorites,links} = _user;
        return response.json({name,email,user,photograph,friends,favorites,links});
    }
}
