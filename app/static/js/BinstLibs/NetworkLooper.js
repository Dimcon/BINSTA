

class NetworkLooper {
    constructor() {
        this.NetInstances = {}
        this.lastPolledAt = new Date()
        this.pollInterval = 2000//ms right? ... Yep.
    }

    CreateNetComponent(Type,datalist) {
        console.log("creating netcomp")
        socket.emit('NetCreateInstance',{
                    applicationID:"BINSTA",
                    instanceType:Type,
                    datalist:datalist
                })
    }

    AddInstance(instance) {
        networkLooper.NetInstances[instance.ApplicationID + ":" + instance.instanceID] = instance
    }

    exists(payloadID) {
        if (payloadID in networkLooper.NetInstances) {
            return true
        }
        console.error("Request for payload ID " + payloadID + " has failed")
        return false
    }

    registerSocketIORecievers() {
        socket.on('NetDataRecieved', function(fromserver) {
            if (networkLooper.exists(fromserver.payloadID)) {
                networkLooper.NetInstances[fromserver.payloadID].PRVonKeyUpdateCompleted(fromserver.key)
            }
        })
        socket.on('FullHashResult', function(fromserver) {
            if (networkLooper.exists(fromserver.payloadID)) {
                networkLooper.NetInstances[fromserver.payloadID].PRVSyncOnLoad(fromserver.data)
            }
        })
        socket.on('NetPollResult', function(fromserver) {
            if (networkLooper.exists(fromserver.payloadID)) {
                networkLooper.NetInstances[fromserver.payloadID].lastPolledAt = fromserver.lastPolledAt
                networkLooper.NetInstances[fromserver.payloadID].PRVSync(fromserver.data)
            }
        })
        socket.on('instanceCreated', function(fromserver) {
            let nc = new NetComponent()
            nc.PRVCreate(fromserver)
            nc.PRVSyncOnLoad(fromserver.hashdata)
            networkLooper.NetInstances[fromserver.applicationID + ":" + fromserver.instanceID] = nc
        })
    }

    pollForUpdatedData() {
        let now = new Date()
        let diff = now - networkLooper.lastPolledAt
        if (diff > networkLooper.pollInterval/2) {
            for (let key in networkLooper.NetInstances) {
                networkLooper.NetInstances[key].PRVPollForNewData()
            }
            networkLooper.lastPolledAt = new Date()
        }
    }
}

class NetComponent {
    constructor() {
        this.ApplicationID = "BINSTA"
        this.instanceID = 0
        this.instanceType = ""
        this.lastPolledAt = ""
        this.KVMap = {}
        this.iKVMap = {}
        this.SendList = {}

    }

    PRVPollForNewData() {
        socket.emit('NetPollHashChanged',{
            payloadID:this.ApplicationID + ":" + this.instanceID,
            lastPolledAt:this.lastPolledAt
        })
    }

    PRVCreate(fromserver) {
        this.ApplicationID = fromserver.applicationID
        this.instanceID = fromserver.instanceID
        this.KVMap = {}
        this.iKVMap = {}
        this.SendList = {}
        this.onCreate()
    }

    PRVDestroy() {

    }

    PRVNeedsSync() {
        socket.emit('NetGetFullHash',{
            payloadID:this.ApplicationID + ":" + this.instanceID
        })
    }

    PRVSyncOnLoad(hashdata) {
        let dataList = {}
        let keyindexes = {}
        //this.instanceID = hashdata.instanceID
        for (let key in hashdata) {
            let kval = key
            let ksub = kval.substring(kval.length - 8,kval.length)
            if (kval.length > 9 && kval.substring(kval.length - 8,kval.length) == ":indexed") {
                let tkey = kval.substring(0,kval.length - 8)
                keyindexes[tkey] = hashdata[key]
            } else {
                dataList[key] = hashdata[key]
            }
        }
        for (let key in dataList) {
            if (key in keyindexes) {
                this.PRVSET(key,dataList[key],keyindexes[key])
            }
        }
        this.onCreate()
        invalidate()
    }
    PRVSync(hashdata) {
            // TODO: Need to update server to set times on a per key basis.
            // TODO:    In order to avoid downloading every value for every key on each poll

            let dataList = {}
            let keyindexes = {}
            for (let key in hashdata) {
                let kval = key
                let indexword = kval.substring(kval.length - 8, kval.length)
                if (kval.length > 8 && indexword === ":indexed") {
                    let tkey = kval.substring(0,kval.length - 8)
                    keyindexes[tkey] = hashdata[key]
                } else {
                    dataList[key] = hashdata[key]
                }
            }
            for (let key in dataList) {
                if (key in keyindexes) {
                    if (!key in this.iKVMap && !key in this.KVMap) {
                        this.PRVSET(key,dataList[key],keyindexes[key])
                    } else if (this.get(key) != dataList[key]) {
                        this.PRVonKeyValueChangedExternally(key,dataList[key])
                    }
                }
            }
        }

    PRVonKeyValueChangedExternally(key, value) {
        let oldval = ""
        if (key in this.KVMap) {
            oldval= this.KVMap[key]
            this.KVMap[key] = value
        } else if (key in this.iKVMap) {
            oldval= this.iKVMap[key]
            this.iKVMap[key] = value
        } else {
            return
        }
        this.onKeyChanged(key,oldval,value)
    }

    PRVSET(key, value, indexed) {
        if (indexed) {
            this.iKVMap[key] = value
        } else {
            this.KVMap[key] = value
        }
    }

    PRVonKeyUpdateCompleted(key) {
        if (key in this.SendList) {
            let slkey = this.SendList[key]
            let oldval = this.get(key)
            this.PRVSET(key,slkey["key"],slkey.indexed)
            let newval = slkey["key"]
            delete this.SendList[key]
            this.onKeyChanged(key, oldval, newval)
        }
    }

    onCreate() {

    }

    onUpdate() {

    }

    onDestroy() {

    }

    keyExists(key) {
        if (key in this.KVMap) {
            return true
        } else if (key in this.iKVMap) {
            return true
        }
        return false
    }

    isOwned() {
        if (this.keyExists("OwnerEmail") && this.get("OwnerEmail") == useremail) {
            return true
        }
        return false
    }

    get(key) {
        if (key in this.KVMap) {
            return this.KVMap[key]
        } else if (key in this.iKVMap) {
            return this.iKVMap[key]
        }
        return null
    }

    isIndexed(key) {
        if (key in this.iKVMap || key in this.KVMap)
            return key in this.iKVMap
        return null
    }

    set(key, value, bIndexable=false) {
        // BE WARNED. This method does not guarantee immediate results.
        this.SendList[key] = {key:value,"indexed":bIndexable}
        socket.emit('NetSendData',{
            payloadID:this.ApplicationID + ":" + this.instanceID,
            key:key,
            value:value,
            indexed:bIndexable
        })
        return !key in this.SendList
    }

    onKeyChanged(key, OldValue, NewValue) {

    }

    onKeyAddedExternally(key, value) {

    }
}

//# sourceURL=NetLooper.js