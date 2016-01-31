function createStyle(d) {
	return function() {
		var ret = d.createElementNS("http://www.w3.org/2000/svg", "style");
		ret.setAttribute("type", "text/css");
		var path = d.createTextNode("path {pointer-events: none;} ");
		var selected = d.createTextNode(
				"rect.selected {fill: none; stroke-width: 15; stroke: green; pointer-events: all;} "
				);
		var hilighted = d.createTextNode(
				"rect.hilight {fill: none; stroke-width: 15; stroke: yellow; pointer-events: all;} "
				);
		var unselected = d.createTextNode(
				"rect.unselected {fill: none; stroke-width: 1; stroke: none; pointer-events: none;} "
				);
		ret.appendChild(path);
		ret.appendChild(selected);
		ret.appendChild(unselected);
		ret.appendChild(hilighted);
		return ret;
	};	
}

function Piece(name, id, square, owner, directions) {
	this.name = name;
	this.id = id;
	this.square = square;
	this.owner = owner;
	this.directions = directions;
	this.moved = false;
	this.first_move = function() {
		return this.moved === false;
	};
	
	this.makeClone = function() {
		var ret = new Piece(this.name, this.id, this.square, this.owner, this.directions);
		return ret;
	};
}

var RookMoves =	{modifier: function(piece, moves) {return moves;}, move_list: [ 
	{ moves: [
	          {x: -1, y: 0}, {x: -2, y: 0}, {x: -3, y: 0}, {x: -4, y: 0}, 
	          {x: -5, y: 0}, {x: -6, y: 0}, {x: -7, y: 0}, 
	]},
	{ moves: [	
	          {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, 
	          {x: 5, y: 0}, {x: 6, y: 0}, {x: 7, y: 0}, 
	]},
	{ moves: [
	          {x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}, 
	          {x: 0, y: 5}, {x: 0, y: 6}, {x: 0, y: 7}, 
	]},
	{ moves: [	
	          {x: 0, y: -1}, {x: 0, y: -2}, {x: 0, y: -3}, {x: 0, y: -4}, 
	          {x: 0, y: -5}, {x: 0, y: -6}, {x: 0, y: -7}, 
	]},			
]};

var KnightMoves = {modifier: function(piece, moves) {return moves;}, move_list: [
	{ moves: [{x: 2, y: 1},  ]},
	{ moves: [{x: 2, y: -1}, ]},  
	{ moves: [{x: -2, y: 1}, ]}, 
	{ moves: [{x: -2, y: -1},]}, 
	{ moves: [{x: 1, y: 2},  ]}, 
	{ moves: [{x: 1, y: -2}, ]},  
    { moves: [{x: -1, y: 2}, ]}, 
    { moves: [{x: -1, y: -2},]},
]};

var BishopMoves = {modifier: function(piece, moves) {return moves;}, move_list: [
                   
	{ moves: [{x:1, y:1}, {x:2, y: 2}, {x:3, y:3}, {x:4, y:4}, {x:5, y:5}, {x:6, y:6}, {x:7, y:7}] },
	{ moves: [{x:-1, y:1}, {x:-2, y: 2}, {x:-3, y:3}, {x:-4, y:4}, {x:-5, y:5}, {x:-6, y:6}, {x:-7, y:7}] },
	{ moves: [{x:1, y:-1}, {x:2, y: -2}, {x:3, y:-3}, {x:4, y:-4}, {x:5, y:-5}, {x:6, y:-6}, {x:7, y:-7}] },
	{ moves: [{x:-1, y:-1}, {x:-2, y: -2}, {x:-3, y:-3}, {x:-4, y:-4}, {x:-5, y:-5}, {x:-6, y:-6}, {x:-7, y:-7}] },

]};

function KingMoveModifier(piece, moves) {
	
	if (theBoard.isValidShortCastle(piece)) {
		moves.push({x: 2, y: 0});
	}
	
	if (theBoard.isValidLongCastle(piece)) {
		moves.push({x: -3, y: 0});
	}
	
	return moves;
}

var KingMoves = {modifier: KingMoveModifier, move_list: [
                 {moves: [{x: 0, y: 1}]}, {moves: [{x: 0, y: -1}]}, {moves: [{x: 1, y: 0}]},
                 {moves: [{x: -1, y: 0}]}, {moves: [{x: -1, y: 1}]}, {moves: [{x: 1, y: 1}]},
                 {moves: [{x: -1, y: -1}]}, {moves: [{x: 1, y: -1}]},
]};

var QueenMoves = {
		modifier: function(piece, moves) {return moves;}, 
		move_list: BishopMoves.move_list.concat(RookMoves.move_list),
};

function BlackPawnModifier(piece, moves, pieceArray) {
	
	var pmove = {x:0, y:-1};
	var ret = moves.slice(0);

	if (!theBoard.isOccupied(piece.square, pmove, pieceArray)) {
		
		var m = {
				moves: [],	
		};
		
		m.moves.push(pmove);
		pmove = {x:0, y:-2};
		if (piece.first_move()) {
			if (!theBoard.isOccupied(piece.square, pmove, pieceArray)) {
				m.moves.push(pmove);
			}	
		}
		ret.push(m);
	}
	
	pmove = {x:1, y:-1};
	if (theBoard.isValidCapture(piece.square, pmove, "BLACK", pieceArray)) {
		ret.push({moves: [pmove]});
	}
	
	pmove = {x:-1, y:-1};
	if (theBoard.isValidCapture(piece.square, pmove, "BLACK", pieceArray)) {
		ret.push({moves: [pmove]});
	}
	
	return ret;
}

function WhitePawnModifier(piece, moves, pieceArray) {
	var pmove = {x:0, y:1};
	var ret = moves.slice(0);

	if (!theBoard.isOccupied(piece.square, pmove, pieceArray)) {
		
		var m = {
				moves: [],	
		};
		
		m.moves.push(pmove);
		pmove = {x:0, y:2};
		if (piece.first_move()) {
			if (!theBoard.isOccupied(piece.square, pmove, pieceArray)) {
				m.moves.push(pmove);
			}	
		}
		ret.push(m);
	}
	
	pmove = {x:1, y:1};
	if (theBoard.isValidCapture(piece.square, pmove, "WHITE", pieceArray)) {
		ret.push({moves: [pmove]});
	}
	
	pmove = {x:-1, y:1};
	if (theBoard.isValidCapture(piece.square, pmove, "WHITE", pieceArray)) {
		ret.push({moves: [pmove]});
	}
	
	return ret;
}

var BlackPawnMoves = {modifier: BlackPawnModifier, move_list: []};
var WhitePawnMoves = {modifier: WhitePawnModifier, move_list: []};

function Board() {
	
	this.toPlay = "WHITE";
	this.whiteCheck = false;
	this.blackCheck = false;

	this.squares = [

	{id:"rect4126", name:"h1"}, {id:"rect4094", name:"h2"}, {id:"rect4090", name:"h3"}, {id:"rect4058", name:"h4"},
	{id:"rect4054", name:"h5"}, {id:"rect4022", name:"h6"}, {id:"rect4018", name:"h7"}, {id:"rect3208", name:"h8"},

	{id:"rect4124", name:"g1"}, {id:"rect4096", name:"g2"}, {id:"rect4088", name:"g3"}, {id:"rect4060", name:"g4"},
	{id:"rect4052", name:"g5"}, {id:"rect4024", name:"g6"}, {id:"rect4016", name:"g7"}, {id:"rect3978", name:"g8"},

	{id:"rect4122", name:"f1"}, {id:"rect4098", name:"f2"}, {id:"rect4086", name:"f3"}, {id:"rect4062", name:"f4"},
	{id:"rect4050", name:"f5"}, {id:"rect4026", name:"f6"}, {id:"rect4014", name:"f7"}, {id:"rect3980", name:"f8"},

	{id:"rect4120", name:"e1"}, {id:"rect4100", name:"e2"}, {id:"rect4084", name:"e3"}, {id:"rect4064", name:"e4"},
	{id:"rect4048", name:"e5"}, {id:"rect4028", name:"e6"}, {id:"rect4012", name:"e7"}, {id:"rect3982", name:"e8"},

	{id:"rect4118", name:"d1"}, {id:"rect4102", name:"d2"}, {id:"rect4082", name:"d3"}, {id:"rect4066", name:"d4"},
	{id:"rect4046", name:"d5"}, {id:"rect4030", name:"d6"}, {id:"rect4010", name:"d7"}, {id:"rect3984", name:"d8"},

	{id:"rect4116", name:"c1"}, {id:"rect4104", name:"c2"}, {id:"rect4080", name:"c3"}, {id:"rect4068", name:"c4"},
	{id:"rect4044", name:"c5"}, {id:"rect4032", name:"c6"}, {id:"rect4008", name:"c7"}, {id:"rect3986", name:"c8"},

	{id:"rect4114", name:"b1"}, {id:"rect4106", name:"b2"}, {id:"rect4078", name:"b3"}, {id:"rect4070", name:"b4"},
	{id:"rect4042", name:"b5"}, {id:"rect4034", name:"b6"}, {id:"rect4006", name:"b7"}, {id:"rect3988", name:"b8"},

	{id:"rect4112", name:"a1"}, {id:"rect4108", name:"a2"}, {id:"rect4076", name:"a3"}, {id:"rect4072", name:"a4"},
	{id:"rect4040", name:"a5"}, {id:"rect4036", name:"a6"}, {id:"rect4004", name:"a7"}, {id:"rect3990", name:"a8"},

	];
	
	this.isValidShortCastle = function(piece) {
		// check if this piece is moved
		// check if this short rook is moved
		// check if occupied x+1, x+2
		// check if x+1 or x+2 is being attacked
	}
	
	this.isValidLongCastle = function(piece) {
		// check if this piece is moved
		// check if this long rook is moved
		// check if occupied x-1, x-2, x-3
		// check if attacked x-1, x-2, x-3
	}
	
	this.isOccupied = function(sname, move, pieceArray) {
		var ret = false;
		var square = this.getSquare(sname);
		var sq = this.getSquareByOffset(square, move);
		
		if (sq == null) {
			return ret;
		}
		
		var p = this.getPieceAtSquare(sq.name, pieceArray);	
		console.log(p !== null);
		
		return p !== null;
	}
	
	this.isValidCapture = function(sname, move, who, pieceArray) {
		var ret = false;
		var square = this.getSquare(sname);
		var sq = this.getSquareByOffset(square, move);
		
		if (sq == null) {
			return ret;
		}
		
		var p = this.getPieceAtSquare(sq.name, pieceArray);
		
		if (p !== null) {
			if (who !== p.owner) {
				ret = true;
				console.log(p);
			}
		}
		
		return ret;
	};
	
	
	this.getValidMoves = function(theSquare, thePiece, who, pieceArray, removeCheck) {
		
		var ret = [];
		var d;
		
		var move_list = thePiece.directions.modifier(
				thePiece, thePiece.directions.move_list, pieceArray); 
		
		for (d in move_list) {
			
			var dir = move_list[d];
			var m;
			
			for (m in dir.moves) {
				var sq = theBoard.getSquareByOffset(theSquare, dir.moves[m]);
			
				if (sq === null) {
					continue;
				}
			
				var p = theBoard.getPieceAtSquare(sq.name, pieceArray);
			
				if (p !== null) {
					
					if (who === p.owner) {
						break;
					}
					
					if (removeCheck) {
						if (this.willCauseCheck(thePiece, who, dir.moves[m], pieceArray)) {
							break;
						}
					}
					
					ret.push(sq);
					break;
					
				} else {
					
					if (removeCheck) {
						if (this.willCauseCheck(thePiece, who, dir.moves[m],  pieceArray)) {
							continue;
						}
					}
					
					ret.push(sq);
				}
			}
		}
		
		return ret; 
	};
	
	this.getPieceAtSquare = function(sname, pieceArray) {
		
		var p;
		for (p in pieceArray) {
			
			if (pieceArray[p].square === sname) {
				return pieceArray[p];
			}
		}
		return null;
		
	};
	
	this.getSquareByOffset = function (sq, offset) {
		var squareName = sq.name;
		var sq_x = squareName.charCodeAt(0);
		var sq_y = squareName.charCodeAt(1);
		var dest = {
				x:  sq_x + offset.x,
				y: sq_y + offset.y,
		};
		
		if (dest.x < "a".charCodeAt(0) || dest.x > "h".charCodeAt(0)
				|| dest.y < "1".charCodeAt(0) || dest.y > "8".charCodeAt(0)) {
			return null;
		}
		
		var destName = String.fromCharCode(dest.x, dest.y);
		return this.getSquare(destName);
	};

	this.squares2 = {};

	var i;
	for(i in this.squares) {
		this.squares2[this.squares[i].id] = this.squares[i].name;
	}
	
	this.piecesX = [
	               	new Piece("whiteRook2", "g3218", "h1", "WHITE", RookMoves),
	                new Piece("whiteKnight2", "g60673", "g1", "WHITE", KnightMoves),
	                new Piece("whiteBishop2", "g3010", "f1", "WHITE", BishopMoves),
	                new Piece("whiteKing", "g82263", "e1", "WHITE", KingMoves),
	                new Piece("whiteQueen", "g80246", "d1", "WHITE", QueenMoves),
				    new Piece("whiteBishop1", "g3388", "c1", "WHITE", BishopMoves),
				    new Piece("whiteKnight1", "g60695", "b1", "WHITE", KnightMoves),
				    new Piece("whiteRook1", "g3416", "a1", "WHITE", RookMoves),
					
					new Piece("whitePawn8", "path3444", "h2", "WHITE", WhitePawnMoves),
					new Piece("whitePawn7", "path3442", "g2", "WHITE", WhitePawnMoves),
					new Piece("whitePawn6", "path3440", "f2", "WHITE", WhitePawnMoves),
					new Piece("whitePawn5", "path3438", "e2", "WHITE", WhitePawnMoves),
					new Piece("whitePawn4", "path3436", "d2", "WHITE", WhitePawnMoves),
					new Piece("whitePawn3", "path3434", "c2", "WHITE", WhitePawnMoves),
					new Piece("whitePawn2", "path3432", "b2", "WHITE", WhitePawnMoves),
					new Piece("whitePawn1", "path2575", "a2", "WHITE", WhitePawnMoves),
					
					new Piece("blackRook1", "g46309", "h8", "BLACK", RookMoves),
	            	new Piece("blackKnight1", "g60728", "g8", "BLACK", KnightMoves),
	            	new Piece("blackBishop1", "g63721", "f8", "BLACK", BishopMoves),
	            	new Piece("blackKing", "g70004", "e8", "BLACK", KingMoves),
	            	new Piece("blackQueen", "g67023", "d8", "BLACK", QueenMoves),
	            	new Piece("blackBishop2", "g63818", "c8", "BLACK", BishopMoves),
	            	new Piece("blackKnight2", "g49858", "b8", "BLACK", KnightMoves),
	            	new Piece("blackRook2", "g46345", "a8", "BLACK", RookMoves),

	            	new Piece("blackPawn8", "path3194", "h7", "BLACK", BlackPawnMoves),
	            	new Piece("blackPawn7", "path17042", "g7", "BLACK", BlackPawnMoves),
	            	new Piece("blackPawn6", "path17044", "f7", "BLACK", BlackPawnMoves),
	            	new Piece("blackPawn5", "path17046", "e7", "BLACK", BlackPawnMoves),
	            	new Piece("blackPawn4", "path17048", "d7", "BLACK", BlackPawnMoves), 
	            	new Piece("blackPawn3", "path17050", "c7", "BLACK", BlackPawnMoves),
	            	new Piece("blackPawn2", "path17052", "b7", "BLACK", BlackPawnMoves),
	            	new Piece("blackPawn1", "path17054", "a7", "BLACK", BlackPawnMoves),
	];

	this.dehilight = function() {
		var h;
		for (h in this.hilighted) {
			var n = this.hilighted[h];
			n.parentNode.removeChild(n);
		}
 				
		this.hilighted = [];	
	};
	
	this.selected = null;
	
	this.select = function(sid) {
 			
 			var ret = sid.cloneNode(true);
 			ret.setAttribute("class", "selected");
 			ret.setAttribute("id", sid.id + "-wrapper");
 			ret.removeAttribute("style");
 			
 			if (this.selected !== null) {
 				sid.parentNode.replaceChild(ret, this.selected);
 			} else {
 				sid.parentNode.appendChild(ret);
 			}
 			
 			$("#" + ret.id).click(this, function(evt) {
 				theBoard.dehilight();
 				theBoard.selected = null;
 				this.parentNode.removeChild(this);
 			});
 			
 			this.selected = ret;
	};
	
	this.isCastle = function(piece, src, dst) {
		
		if (piece.name !== "blackKing") {
			return false;
		}
			
		var diff = this.getDifference(src.name, dst.name);
		return Math.abs(diff.x) > 1;
	};
	
	this.executeCastle = function(piece, src, dst) { 
		this.placePiece(piece, dst);
		var diff = this.getDifference(dst.name, src.name);
		
		var offset;
		if (diff.x > 0) {
			diff.x += 1;
			offset = {x: -2, y: 0};
		} else {
			diff.x -= 2;
			offset = {x: 3, y: 0};
		}
		
		var rsquare = this.getSquareByOffset(src, diff);
		console.log("Rsquare");
		console.log(rsquare);
		var rook = this.getPieceAtSquare(rsquare.name, this.piecesX);
		
		dst = this.getSquareByOffset(rsquare, offset);
		
		this.placePiece(rook, dst);
		
	};
	
	this.applyMove = function(p, who, move, parray) {
		
		var newArray = [];
		var sq = this.getSquareByOffset(this.getSquare(p.square), move);
		for (i in parray) {
			
			var n = parray[i].makeClone();
			if (n.square === sq.name) {
				n.square = null;
			} else if (n.name === p.name) {
				n.square = sq.name;
			}
			
			newArray.push(n);
		}
		
		
		console.log("Apply Move: ");
		console.log(move);
		
		return newArray;
	};
	

	this.isCheck = function(who, pieceArray) {
		//need to pass in the array of pieces in order
		//to check proposed moves!!
		
		var targetKing;
		
		var i;
		for (i in pieceArray) {
			if (pieceArray[i].owner === who) {
				
				var p = pieceArray[i];
				if (who === "WHITE" && p.name === "whiteKing") {
					targetKing = p;
				} else if (who === "BLACK" && p.name === "blackKing") {
					targetKing = p;
				}
				
			}
		}
		
		for (i in pieceArray) {
			
			if (pieceArray[i].owner !== who) {
				var p = pieceArray[i];
				if (p.square === null) {
					continue;
				}
				var sq = this.getSquare(p.square);
				
				var who2 = who === "BLACK" ? "WHITE" : "BLACK";
				
				var moves = this.getValidMoves(sq, p, who2, pieceArray, false);
				
				var j;
				for (j in moves) {
					if (moves[j].name === targetKing.square) {
						// draw white king in red
						// draw attacking piece in red
						console.log("King is in Check from: " + p.name);
						return true;
					}
				}
			}
			
		}
		
		return false;
	};
	
	this.executeRemoteMove = function(data) {
		var sqSrc = data.move.substring(0,2);
		var sqDst = data.move.substring(2,4);
		
		sqSrc = this.getSquare(sqSrc);
		sqDst = this.getSquare(sqDst);
		
		console.log(sqSrc);
		console.log(sqDst);
		
		var piece = this.getPieceAtSquare(sqSrc.name, this.piecesX);
		
		if (this.isCastle(piece, sqSrc, sqDst)) {
			this.executeCastle(piece, sqSrc, sqDst);
		} else {
			this.placePiece(piece, sqDst);
		}

		this.isCheck("WHITE", this.piecesX);
	};
	
	this.willCauseCheck = function(p, who, move, parray) {
		
		var pieceArray = this.applyMove(p, who, move, parray);
		return this.isCheck(who, pieceArray);
		
	}	
		
	this.executeMove = function(hsquare, square, piece) {
		
		console.log("Move: " + piece.name + " to " + square.id);
		console.log(piece);
		console.log(square);
		
		var sq = this.getSquareById(square.id);
		
		$.get("chess/move/" + piece.square + sq.name, function(data) {
			theBoard.executeRemoteMove(data);
		});
		
		this.placePiece(piece, sq);
		this.dehilight();
		
 		theBoard.selected.parentNode.removeChild(theBoard.selected);
 		theBoard.selected = null;
	};
	
	this.hilighted = [];
	this.hilight = function(sid, piece) {
		
	 	var ret = sid.cloneNode(true);
 		ret.setAttribute("class", "hilight");
 		ret.setAttribute("id", sid.id + "-wrapper");
 		ret.removeAttribute("style");
 		
 		sid.parentNode.appendChild(ret);
 			
 		$("#" + ret.id).click(this, function(evt) {
 			theBoard.executeMove(this, sid, piece);
 		});
 			
 		this.hilighted.push(ret);
	};
			
	this.click = function(sid) {
		
		this.select(sid);
		this.dehilight();
		
		var theSquare = this.getSquareById(sid.id);
		var thePiece = this.getPieceAtSquare(theSquare.name, this.piecesX);
		
		console.log("Clicked Piece: " + thePiece.name);
	
		if (thePiece !== null) {
			
			var moves = theBoard.getValidMoves(theSquare, thePiece, "WHITE", this.piecesX, true);
		
			for (i in moves) {
				var e = $("#" + moves[i].id).get(0);
				this.hilight(e, thePiece);
			}
			
		}
		
		return;
		
	}

	this.lookupPiece = function(piece) {
		for(i in this.pieces) {
			if (this.pieces[i].name == piece) {
				return this.pieces[i];
			}
		}
		return undefined;
	}

	this.getSquareById = function(square) {
		for(i in this.squares) {
			if (this.squares[i].id == square) {
				return this.squares[i];
			}
		}
		return undefined;
	}
	
	this.getSquare = function(square) {
		for(i in this.squares) {
			if (this.squares[i].name == square) {
				return this.squares[i];
			}
		}
		return undefined;
	}

	this.getDifference = function (l1, l0) {

		var n1 = l1.charCodeAt(0);
		var n0 = l0.charCodeAt(0);

		var diff1 = n1 - n0;
		n1 = l1.charCodeAt(1);
		n0 = l0.charCodeAt(1);

		var diff2 = n1 - n0;

		return {x:diff1, y:diff2};
	}

	this.placePiece = function(piece, dest) {
		var src = this.getSquare(piece.square);
		piece.moved = true;
		
		if (this.isOccupied(dest.name, {x:0, y:0}, this.piecesX)) {
			var gonzo = this.getPieceAtSquare(dest.name, this.piecesX);
			gonzo.square = null;
			var g = $("#" + gonzo.id).get(0);
			g.parentNode.removeChild(g);
		}
		
		console.log("Src");
		console.log(src);
		console.log("Dest");
		console.log(dest);

		var svg = $("svg").get(0);
		var p_svg = $("#" + piece.id).get(0);

		var offset = this.getDifference(dest.name, src.name);
		var t7 = svg.createSVGTransform();
		t7.setTranslate(offset.x * -150, 1 * offset.y * 150);

		console.log(offset);
		p_svg.transform.baseVal.insertItemBefore(t7, 0); 
		
		piece.square = dest.name;
	}
}

function rotate(svg, p_id) {

	var transform = svg.createSVGTransform();
	var p = $("#" + p_id).get(0);
	var bbox = p.getBBox();

	transform.setRotate(180, 
		bbox.x + bbox.width / 2, 
		bbox.y + bbox.height / 2
	);

	p.transform.baseVal.appendItem(transform);
}

function rotateBoard() {

	var svg = $("svg").get(0);
	console.log(svg);

	var board = $("#theBoard").get(0);
	var transform = $("svg").get(0).createSVGTransform();

	transform.setRotate(180, 600,600);
	var transformList = board.transform.baseVal;
	var t = transformList.consolidate();
	if (transformList.numberOfItems == 0) {
		transformList.appendItem(transform);
	} else {
		transformList.replaceItem(transform, 0);
	}

	var i;
	for (i in theBoard.piecesX) {
		rotate(svg, theBoard.piecesX[i].id);
	}
}

var theBoard;

$(document).ready( function () {

	theBoard = new Board();

 	$.get("AAA_SVG_Chessboard_and_chess_pieces_06.svg", function(data) {
		$("#middle").html(data.documentElement);

		$("svg").get(0).currentScale = .40;
 		$("rect").click(this, function (evt) {
			theBoard.click(this);
 		});
 		
 		$("svg").find("defs").append(createStyle(data));	
 		
		rotateBoard();
		
		$.get("chess/newgame", function(resp) {
			console.log(resp);
			//theBoard.executeRemoteMove({move:"d7d2"});
		});
	});
});