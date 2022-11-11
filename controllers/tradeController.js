const { forEach } = require('async');
const {nextTick} = require('process');
const model = require('../models/trade'); // 

exports.index = (req,res)=>{
    model.find().distinct("set")
    .then(sets=>res.render('./trades/index', {sets}))
    .catch(err=>next(err));
}

exports.new = (req, res, next)=>{
    model.find().distinct("set")
    .then(setsArray=>model.find().distinct("card")
        .then(cardsArray=>res.render('./trades/new', {setsArray, cardsArray}))
        .catch(err=>next(err)))
    .catch(err=>next(err));
}

exports.create = (req,res,next)=>{
    let trade = new model(req.body); //create new doc
    trade.status = "trading";
    trade.save() //insert doc
    .then((trade)=>{
        res.redirect('/trades');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err)
    });   
    //let trade = req.body;
}

exports.view = (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(trade=>{
        if(trade){
            return res.render('./trades/view', {trade});
        } else {
            let err = new Error('Cannot find a trade with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.show = (req, res, next)=>{
    let set = req.params.id;
    model.find({set: set})
    .then(cards=>{
        if(cards){
            return  res.render('./trades/show', {cards});
        } else {
            let err = new Error('This set does not have any cards for trade');
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.edit = (req,res,next)=>{
    let id = req.params.id;    
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    model.find().distinct("set")
    .then(sets=>model.find().distinct("card")
        .then(cards=>model.findById(id)
            .then(trade=>{
                if(trade){
                    return res.render('./trades/edit', {trade, sets, cards});
                } else {
                    let err = new Error('Cannot find a trade with id ' + id);
                    err.status = 404;
                    next(err); 
                }
            })
            .catch(err=>next(err)))
        .catch(err=>next(err)))
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let trade = req.body;
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndUpdate(id,trade,{useFindAndModify: false, runValidators: true})
    .then(trade=>{
        if(trade){
            res.redirect('/trades/view/'+trade._id);
        } else {
            let err = new Error('Cannot find a story with id ' + id);
        err.status = 404;
        next(err);
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
        err.status = 400;
        next(err)   
    });
};

exports.delete = (req,res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    model.findByIdAndDelete(id,{useFindAndModify: false})
    .then(trade=>{
        if(trade){
            res.redirect('/trades/'+trade.set);
        } else {
            let err = new Error('Cannot find a trade with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}