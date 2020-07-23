

function isEmailInFriendList(email) {
    // TODO: This is not reliable. Needs proper framework.
    return friendEmails.indexOf(email) >= 0
}

function sendUpdateToFriends(position, action, message) {
    socket.emit('NetSendUpdate', {
        posx: position.x,
        posy: position.y,
        message: message,
        action: action
    })
}

var friendEmails = []
class Comms {
    constructor() {
        this.vm = null
        $('#CommsView').load("/loadcomms",() => {
            this.setupVue()
        })
        this.lastUpdateTime = 0
        this.newChatConvoID = 0
        this.bFoundNewChatConvo = false

        setInterval(this.sendPoll,3000)
        // Use this for quickly determining if somebody is a friend
    }

    sendPoll() {
        socket.emit('CommsPoll',
        {
            Data: "none",
            LastUpdateTime: "" + comms.lastUpdateTime
        });
    }

    setupSocketCallbacks() {
        socket.on('CommsInitResult', (fromserver) => {
            comms.vm.convos = comms.parseConvos(fromserver.convos)
            comms.vm.friends = comms.parseFriends(fromserver.friends)
            comms.lastUpdateTime = fromserver.lastUpdatedAt
        });
        socket.on('CommsPollResult',(fromserver) => {
            this.lastUpdateTime = fromserver.UpdatedAt

            let convos = comms.parseConvos(fromserver.convos)

            for (let i = 0;i < convos.length;i++) {
               comms.vm.convos.push(convos[i])
            }

            if (this.bFoundNewChatConvo) {
                this.vm.updateConvo(this.newChatConvoID)
                this.newChatConvoID = 0
                this.bFoundNewChatConvo = false
            }

            for (let i = 0;i < fromserver.NewMessages.length;i++) {
                let msg = fromserver.NewMessages[i]
                let convo = comms.getConvoFromID(msg.convoid)
                if (!convo) {
                    console.error("Got message without convo: " + msg.message)
                    return
                }
                msg.hasBeenRead = msg.recievedlist.indexOf(useremail) !== -1
                convo.messages.push(msg)
                if (!msg.hasBeenRead) {
                    convo.unreadCount += 1
                    if (!isNull(comms.vm.getShownConvo()) && comms.vm.getShownConvo().id === convo.id) {
                        comms.markConvoRead(convo)
                    }
                }

            }
            comms.updateTotalUnreadCount()
        })
        socket.emit('CommsInit',
        {
            Name:   "na"
        });

        socket.on('NewConvoWithUserAdded', (fromserver) => {
            // The reason for this is we need a conversation ID before we can send a message
            //      Start a new conversation doesn't necessarily get the ID straight away
            //      And users start a convo by sending a message so ... catch 22?
            this.newChatConvoID = fromserver.convoid
            socket.emit('SendMessage', {
                convoid: fromserver.convoid,
                msg: comms.vm.textinput
            }, () => {
                comms.vm.textinput = ""
                this.sendPoll()
            });
        })

//        socket.emit('SendMessage',
//        {
//            convoid:   "1",
//            msg:        "Testing the message send and recieve system"
//        });

//        socket.emit('AddUsers',
//        {
//            convoid:   "1",
//            users: ['daimonsewell@gmail.com']
//        });
    }

    updateTotalUnreadCount() {
        let convos = comms.vm.convos
        let totalUnread = 0;
        for (let c in convos) {
            totalUnread += convos[c].unreadCount
        }
        comms.vm.totalUnreadCount = totalUnread
        $('#msgbutton').removeAttr('data-badge');
        if (totalUnread > 0)
            $('#msgbutton').attr('data-badge', totalUnread);
    }

    parseFriends(friends) {
        delete this.friendEmails
        friendEmails = []
        for (let c = 0;c < friends.length;c++) {
            let friend = friends[c]
            friend.showInSearch = true
            friendEmails.push(friend.email)
            if (friend.profileimageid > 0) {
                friend.imgsrc = "/getimageid-" + friend.profileimageid
            } else {
                friend.imgsrc = "static/images/cat.png"
            }
        }
        return friends
    }

    getConvoFromID(cid) {
        for (let c = 0; c < comms.vm.convos.length;c++) {
            if (comms.vm.convos[c].id == cid) {
                return comms.vm.convos[c]
            }
        }
        return null
    }

    parseConvos(convos) {
        for (let c = 0;c < convos.length;c++) {
            let convo = convos[c]
            convo.unreadCount = 0
            for (let mindex in convo.messages) {
                let msg = convo.messages[mindex]
                msg.hasBeenRead = msg.recievedlist.indexOf(useremail) !== -1
                if (!msg.hasBeenRead) {
                    convo.unreadCount += 1
                }
            }
            convo.scrollheight = -1
            convo.isactive = false
            if (this.newChatConvoID > 0 && this.newChatConvoID === convo.id) {
                this.bFoundNewChatConvo = true
            }
            // Default value. A facade convo is one that shows the chat but has no messages
            convo.isFacade = false
            if (convo.profileimageid > 0) {
                convo.imgsrc = "/getimageid-" + convo.profileimageid
            } else {
                convo.imgsrc = "static/images/cat.png"
            }
            if (convo.users.length === 1) {
                if (convo.users[0].profileimageid > 0) {
                    convo.imgsrc = "/getimageid-" + convo.users[0].profileimageid
                } else {
                    convo.imgsrc = "static/images/cat.png"
                }
            }
        }
        return convos
    }

    markMessagesRead(msgIDList) {
        socket.emit('SendMessage', {
            msgidlist: msgIDList.join(";"),
            markread: true
        }, () => {
        });
    }

    markConvoRead(convo) {
        let msgids = []
        for (let mindex in convo.messages) {
            let msg = convo.messages[mindex]
            if (!msg.hasBeenRead) {
                msgids.push(msg.messageID)
                msg.recievedlist += ";" + useremail
                msg.hasBeenRead = true
            }
        }
        convo.unreadCount = 0
        this.markMessagesRead(msgids)
        comms.updateTotalUnreadCount()
    }

    setupVue() {
        Vue.component("convo-title-display", {
            props: ["convo"],
            name: 'convo-title-display',
            template:
                `<div class='pl-2 pr-2 notifholder' v-bind:class='{ "activemsgbkg": convo.isactive, "inactivemsgbkg": !convo.isactive }'>
                    <img :src='convo.imgsrc'   
                        v-on:click='$emit("childupdateconvo",convo.id)' 
                        style='border-radius:10vw' 
                        v-bind:class='{ "activemsg": convo.isactive }'
                        class='clickable w-75 ml-2 mr-2 mt-1 mb-1'>
                     <span v-if='convo.unreadCount > 0' class='overlay hasnotif' style='' :data-badge='convo.unreadCount'/>
                </div>`
        });
        Vue.component("convo-display", {
            props: ["convo", "vuseremail"],
            name: 'convo-display',
            methods: {
                formatTime: function (times) {
                    var d = new Date();
                    d.setHours(d.getHours() - 2);
                    if (moment(times).isBefore(d)) {
                        return moment(times).calendar(null, {
                            sameDay: '[Today at] h:mma',
                            nextDay: '[Tomorrow at]h:mma',
                            nextWeek: 'dddd',
                            lastDay: '[Yesterday at] h:mma',
                            lastWeek: '[Last] dddd [ at ] h:mma',
                            sameElse: 'DD/MM/YYYY [ at ] h:mma'
                        });
                    }
                    return moment(times).fromNow() + " at " + moment(times).format("h:mma");;
                    //calendar(null, {
                    //    sameDay: '[Today at] h:mma',
                    //    nextDay: '[Tomorrow at]h:mma',
                    //    nextWeek: 'dddd',
                    //    lastDay: '[Yesterday at] h:mma',
                    //    lastWeek: '[Last] dddd [ at ] h:mma',
                    //    sameElse: 'DD/MM/YYYY [ at ] h:mma'
                    //});
                }
            },
            template:
            `<div class="thinscroll" style="box-sizing: border-box;
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    position: absolute;
    top: 0;
    transition: background .3s ease-out .1s;
    width: 100%;
    z-index: 100;">
            <div id="msglist" class=" msglist  list-group text-light"
            style="">
            <div v-for='(m, index) in convo.messages' >
                  <div v-if='index > 0'>
                      <div v-if='convo.messages[index - 1].useremail !== m.useremail' class="pt-2">
                      </div>
                  </div>
                  <div v-if='m.useremail == vuseremail' class='d-flex justify-content-end' >
                      <div class="msg text-light px-3 py-2 mt-1 ml-5 mr-3 d-flex justify-content-between flex-wrap" style="background: #006356!important;">
                         {{ m.message }}
                         <small class="m-1 ml-2 text-secondary text-right" style="color: #00ab94!important;">
                         {{ formatTime(m.time) }}
                         </small>
                      </div>
                  </div>
                  <div v-else class='d-flex justify-content-start'>
                      <div class="msg text-light px-3 py-2 mt-1 ml-3 mr-5  d-flex justify-content-between flex-wrap" style="background: #914b00!important;">
                        {{ m.message }}
                        <small class="m-1 ml-2 text-secondary text-right" style="color: rgb(241, 157, 68)!important;">
                         {{ formatTime(m.time) }}
                         </small>
                      </div>
                  </div>
            </div>
            </div>
            </div>`
        });
        this.vm = new Vue({
           el: '#CommsViewlistholder',
           delimiters: ["[[","]]"],
           data: {
             vuseremail:useremail,
             message: 'Hello Vue!',
             convos: [],
             totalUnreadCount: 0,
             friends: [],
             showingConvo: 0,
             textinput: "",
             contactSearchInput: "",
             facadeConvo: []
           },
           methods:{
                sendMessage: function() {
                    if (this.showingConvo == -2) {
                        // Somewhat annoyingly, socketIO has no way to return a value instantly.
                        socket.emit('NewConvo',{
                            name: "Convo between " + this.vuseremail + " and " + this.facadeConvo.users[0].email,
                            users: [this.facadeConvo.users[0].email]
                        })
                    } else {
                        socket.emit('SendMessage', {
                            convoid: this.getShownConvo().id,
                            msg: this.textinput
                        }, () => {
                            this.textinput = ""
                        });
                    }
                },
                deleteConvo: function() {
                    socket.emit('LeaveConvo', {
                        convoid: this.getShownConvo().id
                    }, () => {
                        for (let c = 0; c <  this.convos.length;c++) {
                            if (this.convos[c].id == this.getShownConvo().id) {
                                this.convos.splice(c,1)
                                break;
                            }
                        }
                        this.showingConvo = 0
                    });
                },
                getShownConvo: function() {
                    if (this.showingConvo == -2) {
                        return this.facadeConvo
                    }
                    for (let c = 0; c <  this.convos.length;c++) {
                        if (this.convos[c].id == this.showingConvo) {
                            return this.convos[c]
                        }
                    }
                },
                updateConvo: function(cid) {
                    if (this.showingConvo > 0) {
                        let currentconvo = this.getShownConvo()
                        currentconvo.isactive = false
                        currentconvo.scrollheight = $('#msglist').scrollTop()
                    }
                    if (this.showingConvo == -2 && cid != -2) {
                        delete this.facadeConvo
                    }
                    if (cid == -1) {
                        this.showingConvo = cid
                        return
                    }
                    this.showingConvo = cid
                    let newconvo = this.getShownConvo()
                    newconvo.isactive = true
                    comms.markConvoRead(newconvo)
                    newconvo.unreadCount = 0
                    if (newconvo.scrollheight > -1) $('#msglist').scrollTop(newconvo.scrollheight)
                },
                getConvoName: function(convo) {
                    if (convo.users.length == 1) {
                        return convo.users[0].name
                    }
                    return convo.name
                },
                getConvoStatus: function(convo) {
                    if (convo.users.length == 1) {
                        return "// " + convo.users[0].isonline
                    }
                    let s = []
                    for (let i in convo.users) {
                        s.push(convo.users[i].name)
                    }
                    return s.join(", ")
                },
                getTotalUnreadCount: function() {
                    let unreadCount = 0
                    for (let c = 0; c <  this.convos.length;c++) {
                        unreadCount +=  this.convos[c].unreadCount
                    }
                    return unreadCount
                },
                updateSearch: function() {
                    for (let c = 0;c < this.friends.length;c++) {
                        let friend = this.friends[c]
                        if (friend.name.toLowerCase().includes(this.contactSearchInput.toLowerCase())) {
                            friend.showInSearch = true
                        } else {
                            friend.showInSearch = false
                        }
                    }
                },
                clickContact: function (userEmail) {
                    let friend = null
                    for (let c = 0;c < this.friends.length;c++) {
                        if (this.friends[c].email == userEmail) {
                            friend = this.friends[c]
                            break;
                        }
                    }
                    if (friend == null) return

                    for (let c = 0; c <  this.convos.length;c++) {
                        let convo = this.convos[c]
                        if (convo.users.length == 1 && convo.users[0].email == userEmail) {
                            this.updateConvo(convo.id)
                            return
                        }
                    }
                    let facadeconvo = {
                        'name': friend.name,
					    'privacy': friend.email,
					    'id': friend.isonline,
					    'profileimageid': friend.profileimageid,
					    'users': [friend],
					    'messages': []
                    }
                    facadeconvo = comms.parseConvos([facadeconvo])[0]
                    facadeconvo.isFacade = true
                    this.facadeConvo = facadeconvo
                    this.updateConvo(-2)
                    //this.showingConvo = -2
                }
           }

        })
    }
}

//# sourceURL=Comms.js