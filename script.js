let start = [5,9];
	let anchors = [];
	let stop = false;
	var trav= {}
	let grid = function create_grid(rows, columns, cell_width, start, stop) {
		grid_ = []
		id = 1;
		for(i = 0; i < rows; i++) {
			for (j = 0; j < columns; j++) {

				node = $('<div class="node" id="'+id+'" data-loc="'+i+'|'+j+'"></div>');
				node.append('<label>'+id+'<label>');
				node.css({'position':'absolute', 'left':j * cell_width + 'px', 'top': i*cell_width + 'px', 'border' : '#aaa solid 1px', 'width' : cell_width+'px', 'height' : cell_width+'px'});
				if(start[0] == i && start[1] == j) {
					node.addClass('start');
				}if(stop[0] == i && stop[1] == j) {
					node.addClass('end');
				}

				grid_.push(node);
				$('#container').append(node);

				id = i * columns + j + 2;
			}
		}

		$('.node').on('click', function() {
			loc = $(this).attr('data-loc');
			if(anchors.includes(loc)) {
				$(this).removeClass('anchor');
				const index = anchors.indexOf(loc);
				if (index > -1) {
				  anchors.splice(index, 1);
				}
			}
			else {
				anchors.push(loc);
				$(this).addClass('anchor');
			}
		});

		return grid_;

	}
	var random_walk = function(grid, start_pos) {
		var walk = [];

		while(!stop) {
			list = [];
			if(start_pos[0]-1 >= 0)
			{
				list.push([start_pos[0] - 1, start_pos[1]]);
			}
			if(start_pos[1] - 1 >= 0)
			{
				list.push([start_pos[0], start_pos[1] - 1]);
			}
			if(start_pos[0] + 1 < 20)
			{
				list.push([start_pos[0] + 1, start_pos[1]]);
			}
			if(start_pos[1] + 1 < 30)
			{
				list.push([start_pos[0], start_pos[1] + 1]);
			}

			list = list.filter(value => !anchors.includes(value[0] + '|' + value[1]))
			if(list.length <= 0) {
				alert('No position left');
				clearInterval(intId);
				stop = true
				break;
			}
			else {
				walk.push(start_pos);
				start_pos = list[Math.floor(Math.random()*list.length)];
				id = start_pos[0] * 30 + start_pos[1];
				if($('#'+id).hasClass("end")) {
					break;
				}
			}
			
		}
		var intId = setInterval(function() {

			if(walk.length <= 0) {
				clearInterval(intId);
				return;
			}

			v = walk.shift();
			id = v[0] * 30 + v[1] + 1;
			$('#'+id).append('<visited></visited>');
		}, 40);
	}

	var make_path = function(trav) {
		end = '19|12';
		item = end;

		stop = false;
		i = 0;
		while(ud_ != 159) {
			item = trav[item];
			item_ = item.split('|');
			item_[0] = parseInt(item_[0])
			item_[1] = parseInt(item_[1])

			if(i >= trav.length) {
				break;
			}
			ud_ = parseInt(item_[0]) * 30 + parseInt(item_[1] + 1);
			$('#'+ud_).addClass('end');

			if($('#'+ud_).hasClass('start')) {
				stop = true;
				break;
			}
		}
	}

	var bfs = function(grid, start_pos) {
		queue = [start_pos];
		visited = {};
		visited[start_pos] = true;
		currEl = start_pos;

		var intId = setInterval(function() {
			if(queue.length <= 0) {
				make_path(trav);
				clearInterval(intId);
			}

			start_pos = queue.shift();

			ud_ = start_pos[0] * 30 + start_pos[1];

			if(visited.length > 500 || $('#'+ud_).hasClass("end")) {
				clearInterval(intId);
				make_path(trav);
				return;
			}


			if(start_pos) {
				neighbours = [];
				neighbours.push([start_pos[0] - 1, start_pos[1]]);
				neighbours.push([start_pos[0] + 1, start_pos[1]]);
				neighbours.push([start_pos[0], start_pos[1]-1]);
				neighbours.push([start_pos[0], start_pos[1]+1]);
			}

			neighbours = neighbours.filter(value => !anchors.includes(value[0] + '|' + value[1]))
			
			$.each(neighbours, function(k,v) {
				if(v[0] >= 0 && v[1] >= 0 && v[0] < 20 && v[1] < 30) {
					if(!visited[v]) {
						id = v[0] * 30 + v[1] + 1;
						trav[v[0] + '|' + v[1]] = start_pos[0] + '|' + start_pos[1];
						$('#'+id).addClass('visited');
						queue.push(v);
						visited[v] = true;
					}
				}
			});
			currEl = start_pos;
		}, 10);

	}

	g = grid(20, 30, 35, [5,8], [19,12]);