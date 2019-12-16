from app.helpers import *
from app.NLWHandlers import nlwhandlers

@nlwhandlers.route('/pickers', methods=['GET', 'POST'])
def pickers():
	return render_template('PickerHandler.html')

@nlwhandlers.route('/ImagesPicker', methods=['GET', 'POST'])
def ImagesPicker():
	return render_template('ImagesPicker.html')


@socketio.on('NLWPostUpload', namespace='/navengine')
def NLWPostUpload(data):
	# TODO: Updated to work with DB in case redis is down
	#lastPolledAt = data["lastPolledAt"]
	rtype = data["requestType"]
	Bob = current_user
	if rtype == "ImageUpload":
		fileName = data["fileName"]
		fileBlob = data["fileBlob"]
		uploadHash = data["uploadHash"]
		postSessionID = data["postSessionID"]
		imgbytes = getBinaryFromBase64(fileBlob)
		file = File(details="File - PostNLW file;Unmatched;" + postSessionID,
		            file=imgbytes,
		            userid=Bob.id,
		            purposeid=3)
		dbputandcommit(file)
		emit('NLWPostUploadResult', {
			'requestType': rtype,
			'uploadHash': uploadHash,
			'fileID': file.id
		})
		return
	if rtype == 'POSTCleanup':
		fileids = data["fileids"]
		postSessionID = data["postSessionID"]
		files = dbgetlist(File, userid=Bob.id, details="File - PostNLW file;Unmatched;" + postSessionID)
		for file in files:
			if file.id in fileids:
				file.details = "File - PostNLW file;Matched;" + postSessionID
				dbcommit()
			else:
				db.session.delete(file)
		dbcommit()
		emit('NLWPostUploadResult', {
			'requestType': rtype
		})
		return
	emit('NLWPostUploadResult', {})