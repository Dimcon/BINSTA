

class Comms {
    constructor() {
        this.vm = null
        $('#CommsView').load("/loadcomms",() => {
            this.setupVue()
        })


    }

    setupSocketCallbacks() {
        socket.on('CommsInitResult', (fromserver) => {
            this.vm.convos = fromserver.convos
        });
        socket.emit('CommsInit',
        {
            Name:   "na"
        });

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

    setupVue() {
        Vue.component("convo-title-display", {
          props: ["convo"],
          name: 'convo-title-display',
          template:
            "<div>\
              <button type='button' v-on:click='$emit(\"childupdateconvo\",convo.id)' style='border-radius:10vw' class='w-75 ml-2 mr-2 mt-1 mb-1 btn btn-dark'>\
              {{ convo.id }}\
              </button>\
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
             showingConvo: 0
           },
           methods:{
                getShownConvo: function() {
                    for (let c = 0; c <  this.convos.length;c++) {
                        if (this.convos[c].id == this.showingConvo) {
                            return this.convos[c]
                        }
                    }
                },
                updateConvo: function(cid) {
                    this.showingConvo = cid
                    console.log("worked")
                },
                getConvoName: function(convo) {
                    if (convo.users.length == 1) {
                        return convo.users[0].name
                    }
                    return convo.name
                },
                getConvoStatus: function(convo) {
                    if (convo.users.length == 1) {
                        return convo.users[0].isonline
                    }
                    let s = []
                    for (let i in convo.users) {
                        s.push(convo.users[i].name)
                    }
                    return s.join(", ")
                }
           }

        })
    }
}

//# sourceURL=Comms.js