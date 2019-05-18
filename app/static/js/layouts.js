	function change(newpage) {
        $('#content').load(newpage, function() {
        	onLoadComplete()
        	loadedload()
        })
    }

    function switchsearch() {
    	term = $('#searchterm').val()
    	$.post("/search",{
			searchterm: term
		}).done(function(fromserver) {
			change("/search")
		}).fail(function() {
			error("There are no clouds in the sky right now.. you'll need to wait a bit and try again.")
		})
    }

    function onLoadComplete() {
    	processflash(loadedmsgs)
    	loadedmsgs = []
    }

    var loadedmsgs = []



	function processflash(msgs) {
		for (i in msgs) {
			type = msgs[i].slice(0,3)
			if (type == "[i]") {
				flash(msgs[i].slice(3,msgs[i].length))
			} else if (type == "[s]") {
				success(msgs[i].slice(3,msgs[i].length))
			} else if (type == "[!]") {
				error(msgs[i].slice(3,msgs[i].length))
			} else {
				flash(msgs[i])
			}
		}
	}

	function showposter() {
		$('#postarea').load('/poster')
		$('#PostModal').modal()
	}
	function closeposter() {
		$('#PostModal').modal("hide")
	}
    var msgcount = 0

    function remFlash(idname) {
        $(idname).removeClass('show')
        setTimeout(function() {
          $(idname).remove();
        }, 400);
    }
    function rem(idname) {
        setTimeout(function() {
          $(idname).remove();
        }, 400);
    }

    function flash(message) {showmessage(message,'info',false)}
    function error(message) {showmessage(message,'danger',false)}
    function success(message) {showmessage(message,'success',false)}
    function disflash(message) {showmessage(message,'info',true)}
    function diserror(message) {showmessage(message,'danger',true)}
    function dissuccess(message) {showmessage(message,'success',true)}

    function showmessage(message,messagetype,dis) {
        msgcount = msgcount + 1;
        var name = '#flashmsg' + msgcount
        var name2 = '#flashholder' + msgcount
        var name3 = '#flashcol' + msgcount
        $('#flashedmsgs').append( '<div class="row" id="flashholder' + msgcount +
       		'"><div id="flashcol' + msgcount +
       		'" class="col-md-3">&nbsp</div><a id="flashmsg' + msgcount +
       		'" href="#" style="" class="mr-2 ml-2 col-md-6 alert alert-' + messagetype +
       		'">' + message +
       		'</a></div>' );
        setTimeout(function() {
          $(name).addClass('show')
        }, 10);
        $(name).click(function() {
            remFlash(name)
            remFlash(name2)
            remFlash(name3)
        })
        if (dis) {
        	setTimeout(function() {
        	 	remFlash(name)
				remFlash(name2)
				remFlash(name3)
        	}, 4000);
        }
     }

    function makefriend(email,oncomplete) {
		mbfriend(email, true, oncomplete)
	}

	function breakfriend(email,oncomplete) {
		mbfriend(email, false, oncomplete)
	}
	function mbfriend(uemail, mb, oncomplete) {
		uchange = "unfriend"
		if (mb) {
			uchange = "befriend"
		}
		$.post("/friender",{
			change: uchange,
			id: uemail
		}).done(function(fromserver) {
			oncomplete(fromserver)
		}).fail(function() {
		})
		//disflash("We're telling the cloud what you did.")
	}