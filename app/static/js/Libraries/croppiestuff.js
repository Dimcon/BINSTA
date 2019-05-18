function croppieacceptClick() {
		opts = {
			type : 'base64',
			size : 'original',
			format : 'jpeg',
			quality : '1',
			circle : false
		}
		img = croppieimage.result(opts).then(function(blob) {
		    croppiecancelClick()
			$('#cover-drop-zone').attr("src",blob)
			//croppieUploadFileData(blob, '/updateprofileimage')
			$.post("/updateprofileimage",{
				file: blob,
				moredata:'data'
			}).done(function(fromserver) {
			}).fail(function() {
			})
		})

	}

	function croppieUpload(ToAddress,options) {
		opts = {
			type : 'base64',
			size : 'original',
			format : 'jpeg',
			quality : '1',
			circle : false
		}
		img = croppieimage.result(opts).then(function(blob) {
		    croppieimage.destroy()
		    croppieimage = ''
		    delete croppieimage
			$.post("/" + ToAddress,{
				file: blob,
				moredata:options
			}).done(function(fromserver) {
			}).fail(function() {
			})
		})

	}

	function croppieUploadFileData(fileblob, myurl) {
		var data = new FormData();
		files = []
		files.push(fileblob)
    	$.each(files, function(key, value)
    	{
    	    data.append(key, value);
    	});

    	$.ajax({
    	    url: myurl,
    	    type: 'POST',
    	    data: data,
    	    cache: false,
    	    dataType: 'json',
    	    processData: false, // Don't process the files
    	    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    	    success: function(data, textStatus, jqXHR) {

    	    }, error: function(jqXHR, textStatus, errorThrown) {

    	    }
    	});
	}

	function croppierotateClick() {
		if (croppieimage === '') {

		} else {
				croppieimage.rotate('270')
		}
	}

	function croppiecancelClick() {
		$('#btnAccept').addClass("hidden")
		$('#btnCancel').addClass("hidden")
		$('#btnRotate').addClass("hidden")
		$('#fileselectorwrapper').removeClass("hidden")
		croppieimage.destroy()
		$("#cover-drop-zonecover").empty()
		$("#cover-drop-zonecover").append(oldcroppie)
		croppieimage = ''
		delete croppieimage
		croppieSetDropzoneListeners()
	}

	function croppieSetDropzoneListeners() {
		var dropzone = $('#cover-drop-zone');

		dropzone.on('dragover', function() {
		    //add hover class when drag over
		    dropzone.addClass('hover');
		    return false;
		});

		dropzone.on('dragleave', function() {
		    //remove hover class when drag out
		    dropzone.removeClass('hover');
		    return false;
		});

		dropzone.on('drop', function(e) {
		    //prevent browser from open the file when drop off
		    e.stopPropagation();
		    e.preventDefault();
		    dropzone.removeClass('hover');

		    //retrieve uploaded files data
		    var files = e.originalEvent.dataTransfer.files;
		    processCroppieFiles(files);

		    return false;
		});
	}

	function croppiechangeProfileClick() {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                activateCroppie(e,'cover-drop-zone',croppieinit)
            }

            reader.readAsDataURL($('#btnNewDP')[0].files[0]);
        } else {
            alert("This browser does not support FileReader.");
        }
	}

	function setFileButtonPressListener(filebuttonid,onreadhandler) {
	    $("#" + filebuttonid).on('change',
	    {
          btnid: filebuttonid,
          readhandler: onreadhandler
        }
	    ,croppiegetImageFromFileButton)
	}

	function croppiegetImageFromFileButton(event) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                event.data.readhandler(e.target.result)
            }
            reader.readAsDataURL($('#' + event.data.btnid)[0].files[0]);
        } else {
            alert("This browser does not support FileReader.");
        }
	}

	var croppieimage = '';
	var oldcroppie;

	function croppieinit() {
		$('#btnAccept').removeClass("hidden")
		$('#btnRotate').removeClass("hidden")
		$('#btnCancel').removeClass("hidden")
		$('#fileselectorwrapper').addClass("hidden")
	}

	function activateCroppie(e2,itemid,thendothis) {
		if (croppieimage === '') {

		} else {
			croppiecancelClick()
		}
		opts = {
			showZoomer: true,
			enableOrientation: true,
			enableZoom: true,
			customClass: 'croppitcustom',
			viewport: { width: 90, height: 90, type: 'circle' }
		}
		oldcroppie = $('#' + itemid).clone()
		$('#' + itemid).attr("src",e2.target.result)
		croppieimage = new Croppie(document.getElementById('cover-drop-zone'), opts);
		thendothis()
	}

	function processCroppieFiles(files) {
		for (var i=0, file; file=files[i]; i++) {
			if (file.type.match(/image.*/)) {
				var reader = new FileReader();

				reader.onload = function(e2) {
					// finished reading file data.
					activateCroppie(e2,'cover-drop-zone',croppieinit)
				}
				reader.readAsDataURL(file); // start reading the file data.
			}
		}
	}