
(function(){

	function removeAllChildren(elem) {
		while (elem.firstChild)
			elem.removeChild(elem.lastChild);
	}

	function appendText(elem, text) {
		if (typeof text == 'undefined')
			return text;

		if (typeof text != 'string')
			throw new Error('expected string for textnode, got' + (typeof text));

		var textnode = document.createTextNode(text);
		elem.appendChild(textnode);
		return textnode;
	}

	function createchild(elem, tagname, attributes, text) {

		var child = document.createElement(tagname);

		for (var attr_name in attributes) {
			if (attributes.hasOwnProperty(attr_name))
				child.setAttribute(attr_name, attributes[attr_name]);
		}

		appendText(child, text);
		elem.appendChild(child);
		return child;
	}

	function do_printout(printoutzone, drop_event) {
		removeAllChildren(printoutzone);

		var ul = createchild(printoutzone, 'ul', {});

		function printout(item, itemno) {
			var li = createchild(ul, 'li', {});
			var kind_class = 'unknown';
			if (item.kind == 'file') kind_class = 'files';
			if (item.kind == 'string') kind_class = 'strings';
			var text = '#' + itemno + ' ' + item.kind + '(' + item.type + ') ';
			createchild(li, 'span', {'class':kind_class}, text);

			var item_string = createchild(li, 'span', {});
			
			item.getAsString(function(s){
				appendText(item_string, '- ' + s + ' ');
			})
		
			var logItem_btn = createchild(li, 'a', {href:'#'}, 'log item');
			logItem_btn.addEventListener('click', function(ev) {
				console.log(item);
			})

			appendText(li, ' / ');

			var logString_btn = createchild(li, 'a', {href:'#'}, 'log string');
			logString_btn.addEventListener('click', function(ev) {
				item.getAsString(console.log);
			})

		}

		var items = drop_event.dataTransfer.items;
		for (var k = 0; k < items.length; ++k) {
			printout(items[k], k);
		}
	}

	function do_buttons(buttonzone, printoutzone, drop_event) {

		removeAllChildren(buttonzone);

		var logEvent_btn = createchild(buttonzone, 'button', {},
				'console.log the drop event');
		logEvent_btn.addEventListener('click', function(ev) {
			console.log(drop_event);
		});

		var dropped_files = drop_event.dataTransfer.files;

		if (dropped_files.length) {
		      	var logFiles_btn = createchild(buttonzone, 'button', {},
					'log any files');
			logFiles_btn.classList.add('files');
			logFiles_btn.addEventListener('click', function(ev) {
				for (var k = 0; k < dropped_files.length; ++k)
					console.log('file #' + k, dropped_files[k]);
			});
		}

		var reset_btn = createchild(buttonzone, 'button', {
			type:'reset',
		}, 'reset');

		reset_btn.addEventListener('click', function(ev){
			removeAllChildren(buttonzone);
			if (typeof printoutzone != 'undefined')
				removeAllChildren(printoutzone);
		});
	}


	function attachListeners(dropzone, buttonzone, printoutzone) {
		

		function dragover(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			ev.dataTransfer.dropEffect = 'link';
		}

		function dragenter(ev) {
			dropzone.classList.add('hovering');
		}


		function dragleave(ev) {
			dropzone.classList.remove('hovering');
		}

		function drop(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			dragleave(ev);

			console.log('drop!');

			if (typeof buttonzone != 'undefined')
				do_buttons(buttonzone, printoutzone, ev);

			if (typeof printoutzone != 'undefined')
				do_printout(printoutzone, ev);
		}

		function say_thankyou(ev) {
			console.log(ev);
			var old_content = ev.target.innerHTML;
			ev.target.innerHTML = 'thank you!';
			setTimeout(function(){ev.target.innerHTML = ''}, 333);
			setTimeout(function(){ev.target.innerHTML = 'again if you wish'}, 667);
		}

		dropzone.addEventListener('dragover', dragover, false);
		dropzone.addEventListener('dragenter', dragenter, false);
		dropzone.addEventListener('dragleave', dragleave, false);
		dropzone.addEventListener('drop', say_thankyou, false);
		dropzone.addEventListener('drop', drop, false);
	}


	var printoutzone = document.getElementById('printout');
	var buttonzone = document.getElementById('buttons');

	var dropzones = document.getElementsByClassName('dropzone');
	console.log(dropzones);

	for (var k = 0; k < dropzones.length; ++k) {
		console.log(k);
		attachListeners(dropzones[k], buttonzone, printoutzone);
	}
})();
