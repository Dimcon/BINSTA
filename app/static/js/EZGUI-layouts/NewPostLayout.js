
var mainScreenJSON = {
	id: 'mainScreen',
	component: 'Window',
	padding: 4,
	position: { x: 0, y: 0 },
	width: 1000,
	height: 205,

	//layout: [1,3],
	children: [ {
            id: 'label1',
            text: '🔽 Reply',
            font: {
                size: '22px',
                family: 'Helvetica',
                color: '#d0c4bd'
            },
            component: 'Label',
            position: { x: 0, y: 5},
            width: 1000,
            height: 40
        }, {
            id: 'btnImg',
            text: '🖼️ Image',
            component: 'Button',
            position: {x: 45, y:120},

            width: 140,
            height: 60
        }, {
            id: 'btnAudio',
            text: '🎵 Audio',
            component: 'Button',
            position: {x: 200, y:120},

            width: 140,
            height: 60
        },{
               id: 'btnCancel',
               text: 'Cancel',
               component: 'Button',
               position: {x:660, y:120},
               width: 140,
               height: 60
           },{
            id: 'btnPost',
            text: 'Post!',
            title: 't1',
            component: 'Button',
            position: {x: 815, y:120},
            width: 140,
            height: 60
        }
	]
}