let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let HashMap = require('hashmap')
let app = express()

var map = new HashMap();

map.set("Hi", "Hi")
.set("你好", "你好")
.set("Hello", "Hello")
.set("晚餐", "牛肉麵")
.set("名字", "花志雄")
.set("信箱", "chhua531001@gmail.com")

map.forEach(function(value, key) {
    console.log(key + " : " + value);
});

const FACEBOOK_ACCESS_TOKEN = 'EAACfsU8sOJwBAKZBh0DNYBSZAwxbCHcvpzlHoXxNb1XYMVgDNCTZAJSx5RrciG45AqFXlu6ZCLw8V5qLPRW9cAs1ZBu4qYT2Lc9zC46rWnNemFkTHSLvhmiE0iwMEVd55XbwZAzbGiNtmiGH31Hry8xjddYNIe0HnfxesLAkVnUgZDZD'
const PORT = process.env.PORT || 3000
const VERIFY_TOKEN = 'class-hua-1021'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// Facebook Webhook
app.get('/', function (req, res) {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Invalid verify token')
    }
})

// handler receiving messages
app.post('/', function (req, res) {
    let events = req.body.entry[0].messaging
    for (i = 0; i < events.length; i++) {
        let event = events[i]
        if (event.message) {
            if (event.message.text) {

                var text = event.message.text
                
                    map.forEach(function(value, key) {
        
                        if(text.indexOf(key) != -1) {
                            text = value
                        }                
                        // console.log(key + " : " + value);
                    });

                sendMessage(event.sender.id, { text: text })
            }
        }
    }
    res.sendStatus(200)
})

// generic function sending messages
function sendMessage(recipientId, message) {
    let options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: message,
        }
    }
    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
