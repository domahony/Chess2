
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
	
	if (piece.can_castle()) {
		return moves;
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
		move_list: BishopMoves.move_list.concat(RookMoves),
};

function BlackPawnModifier(piece, moves) {
	
	if (piece.first_move()) {
		moves.concat({x: 0, y: -2});
	}
	
	var pmove = {x:1, y:-1};
	if (theBoard.captureable(piece.square, pmove)) {
		moves.concat(pmove);
	}
	
	pmove = {x:-1, y:-1};
	if (theBoard.captureable(piece.square, pmove)) {
		moves.concat(pmove);
	}
	
	return moves;
}

function WhitePawnModifier(piece, moves) {
	if (piece.first_move()) {
		moves.concat({x: 0, y: 2});
	}
	
	var pmove = {x:1, y:1};
	if (theBoard.captureable(piece.square, pmove)) {
		moves.concat(pmove);
	}
	
	pmove = {x:-1, y:1};
	if (theBoard.captureable(piece.square, pmove)) {
		moves.concat(pmove);
	}
	
	return moves;
}

var BlackPawnMoves = {modifier: BlackPawnModifier, move_list: [
	{moves: [ {x:0, y:-1} ]}                      
]};

var WhitePawnMoves = {modifier: WhitePawnModifier, move_list: [
	{moves: [ {x:0, y:1} ]}                      
]};

function Board() {
	
	this.toPlay = "BLACK";

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
	
	this.getValidMoves = function(theSquare, thePiece) {
		
		var ret = []; 
		var d;
		for (d in thePiece.directions.move_list) {
			
			var dir = thePiece.directions.move_list[d];
			var m;
			
			for (m in dir.moves) {
				var sq = theBoard.getSquareByOffset(theSquare, dir.moves[m]);
			
				if (sq == null) {
					continue;
				}
			
				console.log(sq);
				var p = theBoard.getPieceAtSquare(sq.name);
			
				if (p != null) {
					
					if (this.toPlay != p.owner) {
						ret.push(sq);
						console.log(p)
					}
					break;
				} else {
					ret.push(sq);
				}
			}
		}
		
		return thePiece.directions.modifier(thePiece, ret);
	}
	
	this.getPieceAtSquare = function(sname) {
		
		var p;
		for (p in this.pieces) {
			
			if (this.pieces[p].square == sname) {
				return this.pieces[p];
			}
		}
		return null;
		
	}
	
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
	}

	this.squares2 = {};

	var i;
	for(i in this.squares) {
		this.squares2[this.squares[i].id] = this.squares[i].name;
	}
	
	this.pieces = [
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

	this.move = {
		m1: "",
		m2: "",
	};

	this.click = function(sid) {
		
		var i;
		var sname;
		var theSquare;
		for(i in this.squares) {
			if (this.squares[i].id == sid) {
				sname = this.squares[i].name;
				theSquare = this.squares[i];
			}
		}
		console.log(sname);
		
		var j;
		var thePiece;
		for (j in this.pieces) {
			if (this.pieces[j].square == sname) {
				thePiece = this.pieces[j];
				console.log("Clicked Piece: " + this.pieces[j].name);
			}
		}
		
		var moves = theBoard.getValidMoves(theSquare, thePiece);
		
		console.log(moves);
		
		return;

		if (this.move.m1 != "" && this.move.m2 != "") {
			this.move.m1 = square;
			this.move.m2 = "";
		} else if (square == this.move.m1) {
			this.move.m1 = "";	
			this.move.m2 = "";
		} else if (square == this.move.m2) {
			this.move.m2 = "";
		} else if (this.move.m1 == "") {
			this.move.m1 = square;	
			this.move.m2 = "";
		} else {
			this.move.m2 = square;
			$.get("chess/move/" + this.move.m1 + this.move.m2);
			console.log("Current Move: " + this.move.m1 + this.move.m2);
		}


	}

	this.getPiece = function(piece) {
		for(i in this.pieces) {
			if (this.pieces[i].name == piece) {
				return this.pieces[i];
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

	this.placePiece = function(piece, square) {
		var p = this.getPiece(piece);
		var dest = this.getSquare(square); 
		var src = this.getSquare(p.square);

		var svg = $("svg").get(0);
		var p_svg = $("#" + p.id).get(0);

		var offset = this.getDifference(dest.name, src.name);
		var t7 = svg.createSVGTransform();
		t7.setTranslate(offset.x * -150, 1 * offset.y * 150);

		console.log(offset);
		p_svg.transform.baseVal.insertItemBefore(t7, 0); 
		
		p.square = dest.name;
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
	for (i in theBoard.pieces) {
		rotate(svg, theBoard.pieces[i].id);
	}
}

var theBoard;

$(document).ready( function () {

	theBoard = new Board();

 	$.get("AAA_SVG_Chessboard_and_chess_pieces_06.svg", function(data) {
		$("#middle").html(data.documentElement);

		$("svg").get(0).currentScale = .40;
 		$("rect").click(this, function (evt) {
 			
 			/*
			console.log(this.id + " Clicked! " 
				+ this + " " + evt.target);
			console.log(theBoard.squares2[this.id]);
			*/
			
			theBoard.click(this.id);
			
			
 		});
		rotateBoard();
		/*
		theBoard.placePiece("whiteKing", "e3");
		theBoard.placePiece("whiteBishop2", "e4");
		theBoard.placePiece("whiteKnight2", "e6");
		theBoard.placePiece("whitePawn1", "c3");
		theBoard.placePiece("whitePawn6", "f6");
		theBoard.placePiece("blackPawn6", "f3");
		*/
	});
});