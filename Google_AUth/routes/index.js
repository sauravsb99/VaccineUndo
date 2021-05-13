const router = require('express').Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', ensureGuest ,(req, res) => {
    res.render('login',{ about: false})
  })

router.get("/log",ensureAuth, async(req,res)=>{
    // res.render('index',{userinfo:req.email})
    console.log(req.user.email);
    res.render('index',{ about: false , email: req.user.email})
})
module.exports=router;