

function isEmailInFriendList(email) {
    // TODO: This is not reliable. Needs proper framework.
    return friendEmails.indexOf(email) >= 0
}

var friendEmails = []
class Comms {
    constructor() {
        this.vm = null
        $('#CommsView').load("/loadcomms",() => {
            this.setupVue()
        })
        this.lastUpdateTime = 0
        this.waitingForConvoWithID = 0
        this.FoundConvoWithID = false
        //setInterval(this.sendPoll,3000)
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
            this.vm.convos = comms.parseConvos(fromserver.convos)
            this.vm.friends = comms.parseFriends(fromserver.friends)
        });
        socket.on('CommsPollResult',(fromserver) => {
            this.lastUpdateTime = fromserver.UpdatedAt

            let convos = comms.parseConvos(fromserver.convos)

            for (let i = 0;i < convos.length;i++) {
               comms.vm.convos.push(convos[i])
            }

            if (this.FoundConvoWithID) {
                this.vm.updateConvo(this.waitingForConvoWithID)
                this.waitingForConvoWithID = 0
                this.FoundConvoWithID = false
            }

            for (let i = 0;i < fromserver.NewMessages.length;i++) {
                let msg = fromserver.NewMessages[i]
                let convo = comms.getConvoFromID(msg.convoid)
                if (!convo) {
                    console.err("Got message without convo: " + msg.message)
                    return
                }
                convo.messages.push(msg)
            }
        })
        socket.emit('CommsInit',
        {
            Name:   "na"
        });

        socket.on('NewConvoWithUserAdded', (fromserver) => {
            // The reason for this is we need a conversation ID before we can send a message
            //      Start a new conversation doesn't necessarily get the ID straight away
            //      And users start a convo by sending a message so ... catch 22?
            this.waitingForConvoWithID = fromserver.convoid
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
            convo.scrollheight = -1
            convo.unreadCount = 2
            convo.isactive = false
            if (this.waitingForConvoWithID > 0 && this.waitingForConvoWithID == convo.id) {
                this.FoundConvoWithID = true
            }
            convo.isFacade = false
            if (convo.profileimageid > 0) {
                convo.imgsrc = "/getimageid-" + convo.profileimageid
            } else {
                convo.imgsrc = "static/images/cat.png"
            }
            if (convo.users.length == 1) {
                if (convo.users[0].profileimageid > 0) {
                    convo.imgsrc = "/getimageid-" + convo.users[0].profileimageid
                } else {
                    convo.imgsrc = "static/images/cat.png"
                }
            }
        }
        return convos
    }

    setupVue() {
        Vue.component("convo-title-display", {
            props: ["convo"],
            name: 'convo-title-display',
            template:
                "<div class='pl-2 pr-2' v-bind:class='{ \"activemsgbkg\": convo.isactive, \"inactivemsgbkg\": !convo.isactive }'>\
                    <img :src='convo.imgsrc'   \
                        v-on:click='$emit(\"childupdateconvo\",convo.id)' \
                        style='border-radius:10vw' \
                        v-bind:class='{ \"activemsg\": convo.isactive }'\
                        class='clickable w-75 ml-2 mr-2 mt-1 mb-1'>\
                     <span v-if='convo.unreadCount > 0' class='overlay hasnotif' style='float: right;' :data-badge='convo.unreadCount'/>\
                </div>"
        });
        Vue.component("convo-display", {
            props: ["convo", "vuseremail"],
            name: 'convo-display',
            template:
            " <div>\
            <div v-for='m in convo.messages' >\
                  <div v-if='m.useremail == vuseremail' class='list-group-item msg text-light bg-dark pt-2 pb-2 pl-3 mt-2 mb-1 ml-5 mr-1'>\
                      {{ m.message }}\
                  </div>\
                  <div v-else class='list-group-item msg text-light text-align-right bg-dark  pt-2 pb-2 pl-3 mt-2 mb-1 ml-1 mr-5'>\
                      {{ m.message }}\
                  </div>\
              </div>\
              </div>"
        });
        this.vm = new Vue({
           el: '#CommsViewlistholder',
           delimiters: ["[[","]]"],
           data: {
             vuseremail:useremail,
             message: 'Hello Vue!',
             convos: [],
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
                    this.showingConvo = cid
                    let newconvo = this.getShownConvo()
                    newconvo.isactive = true
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