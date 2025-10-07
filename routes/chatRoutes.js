const express = require('express')
const router = express.Router()

router.get('/demoChat', (req, res) => { // Success page
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({ title: 'Socket' })
    }
    else return res.render('../views/chat/demoChat', { title: 'Socket' })

})
router.get('/chat', (req, res) => { // Success page
    if (req.headers['clienttype' || 'clientType'] === 'mobile' || req.headers['clienttype' || 'clientType'] === 'postman') {
        return res.status(200).json({ title: 'FriendWithGroup', tab: req.query.tab })
    }
    else return res.render('../views/chat/chatFriendWithGroup', { title: 'FriendWithGroup', tab: req.query.tab })
})

module.exports = router