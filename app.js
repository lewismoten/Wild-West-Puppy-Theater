(function() {

	var root = this,
		context = {};

	addGetter(root, "north", move.bind(context, 0, -1));
	addGetter(root, "south", move.bind(context, 0, 1));
	addGetter(root, "east", move.bind(context,  1, 0));
	addGetter(root, "west", move.bind(context, -1, 0));
	addGetter(root, "redraw", move.bind(context, 0, 0));
	addGetter(root, "start", newMaze.bind(context, 5, 5));
	
	start;

	return;

	function addGetter(target, name, callback) {
		Object.defineProperty(target, name, { get: callback });
	}

	function move(x, y) {
		var context = this;
		console.clear();

		var move = canMove(context.maze, context.x, context.y, x, y);

		if(move){
			this.x += x;
			this.y += y;
		}

		if(this.x === context.goal.x && this.y === context.goal.y) {
			console.log('You won! Type [start] to start again.');
			return;
		}
		
		drawMaze.call(context);

		if(move) {
			return 'ok';
		}

		return 'You can not move in that direction!';
		
	};

	function drawMaze() {
		var context = this,
			maze = context.maze;
		var text = '';
		var tops = '';
		var lefts = '';

		for(var y = 0; y < maze[0].length; y++ ) {
			tops = '';
			lefts = '';

			for(var x = 0; x < maze.length; x++) {
				var cell = maze[x][y];

				var spot = '  ';
				switch(true) {
					case (context.x === x && context.y === y):
						spot = ':)';
						break;
					case (context.goal.x === x && context.goal.y === y):
						spot = '@@';
						break;
				}
				lefts += (x === 0 || cell.left) ? '|' : ' ';
				lefts += spot;
				tops += (y === 0 || cell.top) ? '+--' : '+  ';
			}
			lefts += '|';
			tops += '+';
			text += tops + '\n';
			text += lefts + '\n';
		}

		tops = '';
		for(var x = 0; x < maze.length; x++) {
			tops += '+--';
		}
		text += tops + '+';

text += '\n\nCommands: ';
	if(canMove(context.maze, context.x, context.y, 0, -1)) text += 'north, ';
	if(canMove(context.maze, context.x, context.y, 0, 1)) text += 'south, ';
	if(canMove(context.maze, context.x, context.y, 1, 0)) text += 'east, ';
	if(canMove(context.maze, context.x, context.y, -1, 0)) text += 'west, ';
	text += 'start, redraw';

		console.log(text);
	}

	function newMaze(width, height) {
		var cells = [];
		var stack = [];
		for(var x = 0; x < width; x++) {
			var columns = [];
			for(var y = 0; y < height; y++) {

				var pos = {
					top: (y === 0),
					left: (x === 0)
				};

				columns.push(pos);

				if(y !== 0) {
					stack.push({x: x, y: y, top: true});
				}

				if(x !== 0) {
					stack.push({x: x, y: y, top: false});
				}
			}
			cells[x] = columns;
		}


		stack.sort(function(){ return Math.random() < 0.5 ? -1 : 1; });

		var maxWalls = 2;

		for(key in stack) {
			var pos = stack[key];
			var x = pos.x;
			var y = pos.y;

			if(wallCount(cells, x, y) >= maxWalls) continue;

			var cell = cells[x][y];

			if(pos.top) {
				if(wallCount(cells, x, y - 1) >= maxWalls) continue;
				cell.top = true;
			} else {
				if(wallCount(cells, x - 1, y) >= maxWalls) continue;
				cell.left = true;
			}
		}

		this.width = width;
		this.height = height;
		this.maze = cells;
		this.x = 0;
		this.y = 0;
		this.goal = {
			x: width - 1,
			y: height - 1
		};

		root.redraw;
	}

	function wallCount(cells, x, y) {
		return [
			canMove(cells, x, y, 1, 0),
			canMove(cells, x, y, -1, 0),
			canMove(cells, x, y, 0, 1),
			canMove(cells, x, y, 0, -1)
			].filter(function(v){return v===false;}).length;
	}

	function canMove(cells, x, y, moveX, moveY) {

		if(moveX === 0 && moveY === 0) return true;

		var cell = getCell(cells, x, y);
		if(cell === null) return false;
		if(moveX === -1) return !(x === 0 || cell.left);
		if(moveY === -1) return !(y === 0 || cell.top);


		var toCell = getCell(cells, x + moveX, y + moveY);
		if(toCell === null) return false;

		if(moveX === 1) return !toCell.left;
		if(moveY === 1) return !toCell.top;

		return false;
	}

	function getCell(cells, x, y) {
		return (x < 0 || y < 0 || x >= cells.length || y >= cells[0].length) ? null : cells[x][y];
	}

}).call();
