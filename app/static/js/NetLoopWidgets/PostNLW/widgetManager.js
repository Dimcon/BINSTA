
(function () {

    let finalFunc = function() {
        this.createNLWInstance(Position, {
            "Position": Position.x + ";" + Position.y,
            "CreateDate": new Date().toISOString()
        })
    }
    let htmlmodal = `
        

        <script>
            var UploadContent = {}
            var UploadContentByHash = {}
            var UploadContentid = 0
            var postSessionID = 0
            var MD5
            function removeContentWithID(contid) {
                $('#Content-' + contid).remove()
                delete UploadContentByHash[UploadContent[contid].uploadHash]
                delete UploadContent[contid]
                
                console.log(UploadContent)
            }
            function UploadSetLoading(contID) {
                $('#loadinfo-' + contID).remove()
                $('#Content-' + contID).append(\`
                    <a href="#" id="loadinfo-\` + contID + \`" class="loadinfo bg-dark d-flex justify-content-center align-items-center">
                        <i style="font-size: 1.3em;" class="ml-1 far fa-clock"></i>
                    </a>
                \`)
            }
            function UploadSetDone(contID) {
                $('#loadinfo-' + contID).remove()
                $('#Content-' + contID).append(\`
                    <a href="#" id="loadinfo-\` + contID + \`" style="background: linear-gradient(45deg, #343a40, transparent);" class="loadinfo d-flex justify-content-left align-items-center">
                        <i class="fas ml-1 fa-check-circle"></i>
                    </a>
                \`)
            }
            function UploadSetError(contID) {
                $('#loadinfo-' + contID).remove()
                $('#Content-' + contID).append(\`
                    <a href="#" id="loadinfo-\` + contID + \`" class="loadinfo bg-dark d-flex justify-content-center align-items-center">
                        <i class="fas mr-1 text-warning fa-exclamation-triangle"></i>
                        <i class="fas ml-1 text-warning fa-sync"></i>
                    </a>
                \`)
            }
            function startUpload(contID) {
                let file = UploadContent[contID]
                console.log(file)
                socket.emit('NLWPostUpload',{
                    requestType: "ImageUpload",
                    fileName:   file.fileName,
                    fileBlob:   file.fileBlob,
                    uploadHash: file.uploadHash,
                    postSessionID: postSessionID
                })
                UploadSetLoading(contID)
            }
            function Post() {
                let fileids = []
                for (let index in UploadContent) {
                    let file = UploadContent[index]
                    fileids.push(file.fileid)
                }
                socket.emit('NLWPostUpload',{
                    requestType: "POSTCleanup",
                    fileids:   fileids,
                    postSessionID: postSessionID
                })
            }
            function CheckForUploadedFiles() {
                let hasUnUploadedFiles = false
                for (let fileindex in UploadContent) {
                    let file = UploadContent[fileindex]
                    if (file.status == "syncing") {
                        hasUnUploadedFiles = true
                    }
                }
                if (!hasUnUploadedFiles) {
                    $('#btnPost').attr("disabled", false);
                    return false
                } else {
                    $('#btnPost').attr("disabled", true);
                    return true
                }
            }
            (function () {
                MD5 = new Hashes.MD5
                postSessionID = MD5.hex(new Date().toISOString() + "POSTNLW:" + useremail)
                socket.on('NLWPostUploadResult', function(fromserver) {
                    if (fromserver.requestType == "ImageUpload") {
                        console.log(fromserver)
                        let contID = UploadContentByHash[fromserver.uploadHash]
                        UploadSetDone(contID)
                        UploadContent[contID].fileid = fromserver.fileID
                        UploadContent[contID].status = "Uploaded"
                        CheckForUploadedFiles()
                    }
                    if (fromserver.requestType == "POSTCleanup") {
                        let fileids = []
                        for (let index in UploadContent) {
                            let file = UploadContent[index]
                            fileids.push(file.fileid)
                        }
                        let wposition = new Vector((centerScreenRelToUser.x / unitsize) - (4), (centerScreenRelToUser.y / unitsize) - (3.5))
                        tmpNLW.createNLWInstance(wposition, {
                            "Text": $('#postcomment').val(),
                            "Fileids": fileids,
                            "Position": wposition.x + ";" + wposition.y,
                            "CreateDate": new Date().toISOString()
                        })
                        $('#mymodal').modal("hide")
                    }
                })
                $('#btnPost').on('click', Post)
                $('#mymodal').modal()
                const button = document.querySelector('#emoji-button');
                const picker = new EmojiButton({
                    rootElement: document.querySelector('#mymodal'),
                    showPreview: false,
                    showRecents: true,
    
                });
                picker.on('emoji', emoji => {
                  document.querySelector('#postcomment').value += emoji;
                });
                button.addEventListener('click', () => {
                  picker.pickerVisible ? picker.hidePicker() : picker.showPicker(button);
                });
                $('#mymodal').on('hide.bs.modal', function (e) {
                  $('#JSLoadHere').empty()
                })
                FileInputHandler.bindFileInputButtonToHandler("#postFileBtn", (fileName, fileBlob) => {
                    console.log(fileName)
                    UploadContentid += 1
                    var MD5 = new Hashes.MD5
                    let uploadHash = MD5.hex(new Date().toISOString() + fileName)
                    UploadContent[UploadContentid] = {
                        fileName: fileName,
                        fileBlob: fileBlob,
                        uploadHash: uploadHash,
                        status: "syncing"
                    }
                    UploadContentByHash[UploadContent[UploadContentid].uploadHash] = UploadContentid
                    let contID = "Content-" + UploadContentid
                    let html = \` <div id="\` + contID + \`" class="m-2 pictureholder">
                                <img style="object-fit: cover;width: 7rem;height: 7rem;" src="\` + fileBlob + \`">
                                <a href="#" onclick="removeContentWithID(\` + UploadContentid + \`)" class="closebtn round d-flex justify-content-center align-items-center">
                                    x
                                </a>
                              </div> \`
                    $('#PictureList').append(html)
                    startUpload(UploadContentid)
                    CheckForUploadedFiles()
                })
            }());
            
//# sourceURL=PostNLWManagerInsertCode.js
        </script>
        
        <style>
            .pictureholder {
                border-radius: 0.25rem;
                box-shadow: 0px 3px 7px #0000005c;position:relative;background:darkgrey;width: 7rem;height:7rem
            }
            .closebtn {
                right:0;top:0;position:absolute;width: 1.5rem;height:1.5rem
            }
            .loadinfo {
                bottom:0;left:0;right:0;position:absolute;height:2rem
            }
        </style>
        <input id="postFileBtn" type="file" multiple style="visibility:hidden" />
        <div id="mymodal" class="modal fade" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content bg-dark text-light">
              <div class="modal-body">
              <div class="">
                <h3>
                    Create post
                </h3>
              </div>
              <div class="mb-3 mt-3 d-flex justify-content-start align-items-center">
<!--                <div style="background:#1b1e21;width: 3rem;height:3rem" class="m-2 imagePlaceHolder"></div>-->
                <div class="w-100">
                    <textarea id="postcomment" placeholder="Say something" class="form-control bg-dark text-light" rows="2" id="comment"></textarea>
                </div>
                <button id="emoji-button" style="border-radius: 5rem" class="btn btn-dark d-flex align-items-center">
                       <i class="fa-2x far fa-grin-tongue"></i>
                </button>
              </div>
                <div class="mb-2 d-flex flex-wrap justify-content-between">
                    <button data-dismiss="modal" data-target="#mymodal" class="btn btn-dark d-flex align-items-center">
                         Cancel
                    </button>
                    <div class="d-flex">
                        <button onclick="$('#postFileBtn').click();" id="btnAddStuff" class="btn btn-dark d-flex align-items-center">
                            <i class="mr-2 far  fa-file-image"></i>
                            <i class="mr-2 fas  fa-video"></i>
                            <i class="fas fa-file-alt"></i>
                        </button>
                        
                    </div>
                    <button style="border-radius: 5rem" id="btnPost" class="pl-4 pr-3 btn btn-outline-success d-flex align-items-center">
                         Post <i class="ml-2 fas fa-fighter-jet"></i>
                    </button>
                </div>
              <hr class="m-1">
              <div style="
                border-radius:0.25rem;
                overflow: auto;
                background: #3c3c3c;
                box-shadow: inset 0px 0px 8px black;" id="PictureList"
                class="shadow m-1 p-2 d-flex justify-content-center flex-wrap pre-scrollable">
<!--                <div class="m-2 pictureholder">-->
<!--                    <img style="object-fit: cover;width: 7rem;height: 7rem;" src="https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg">-->
<!--                    <a href="#" class="closebtn round d-flex justify-content-center align-items-center">-->
<!--                        x-->
<!--                    </a>-->
<!--                    <a href="#" id="loadinfo-2" class="loadinfo bg-dark d-flex justify-content-center align-items-center">-->
<!--                        <i style="font-size: 1.3em;" class="ml-1 far fa-clock"></i>-->
<!--                    </a>-->
<!--                </div>-->
<!--                <div class="m-2 pictureholder">-->
<!--                    <img style="object-fit: cover;width: 7rem;height: 7rem;" src="https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg">-->
<!--                    <a href="#" class="closebtn round d-flex justify-content-center align-items-center">-->
<!--                        x-->
<!--                    </a>-->
<!--                    <a href="#" id="loadinfo-2" style="background: linear-gradient(45deg, #343a40, transparent);" class="loadinfo d-flex justify-content-left align-items-center">-->
<!--                        <i class="fas ml-1 fa-check-circle"></i>-->
<!--                    </a>-->
<!--                </div>-->
<!--                <div class="m-2 pictureholder">-->
<!--                    <img style="object-fit: cover;width: 7rem;height: 7rem;" src="https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg">-->
<!--                    <a href="#" class="closebtn round d-flex justify-content-center align-items-center">-->
<!--                        x-->
<!--                    </a>-->
<!--                    <a href="#" id="loadinfo-2" class="loadinfo bg-dark d-flex justify-content-center align-items-center">-->
<!--                        <i class="fas mr-1 text-warning fa-exclamation-triangle"></i>-->
<!--                        <i class="fas ml-1 text-warning fa-sync"></i>-->
<!--                    </a>-->
<!--                </div>-->
              </div>
              
              </div>
            </div>
          </div>
        </div>
        
    `
    let nlw = new NetLoopWidgetBase("BINSTA", "PostWidget")

    let loaderID = 'PostNLW'
    let NLWcurrentURL = NLWWidgetList[loaderID][0]
    loadJavascriptFromUrl(NLWcurrentURL + "widget.js", ()=> {
        tmpNLW = nlw
        nlw.setDisplayImage(null)

        nlw.setDisplayDescription("Content Post", "Add text to the plane", "Add Text Post")
        nlw.setDisplayRequiredInfo()

        nlw.doOnCreate(function (Position, args) {
            replacePlaceholderWithHtml(htmlmodal, '#JSLoadHere')
        })
        nlw.doOnLoad(function (iID, DataComp) {
            return new PostNLW(iID, DataComp)
        })
        nlw.doOnDestroy(function () {

        })

        nlw.Save()
    })
}());
var tmpNLW = 0


//# sourceURL=PostNLWManager.js

