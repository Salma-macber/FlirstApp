const express = require('express')
const router = express.Router()

router.get('/demoChat', (req, res) => { // Success page
    res.render('../views/chat/demoChat', { title: 'Socket' })

})
router.get('/chat', (req, res) => { // Success page

    res.render('../views/chat/chatFriendWithGroup', { title: 'FriendWithGroup', tab: req.query.tab })

})

module.exports = router