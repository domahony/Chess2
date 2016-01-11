
function Board() {

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

	this.squares2 = {};

	var i
	for(i in this.squares) {
		this.squares2[this.squares[i].id] = this.squares[i].name;
	}

	this.pieces = [
		{
			name: "whiteRook2",
			id: "g3218",
			square: "h1",
		},
		{
			name: "whiteKnight2",
			id: "g60673",
			square: "g1",
		},
		{
			name: "whiteBishop2",
			id: "g3010",
			square: "f1",
		},
		{
			name: "whiteKing",
			id: "g82263",
			square: "e1",
		},
		{
			name: "whiteQueen",
			id: "g80246",
			square: "d1",
		},
		{
			name: "whiteBishop1",
			id: "g3388",
			square: "c1",
		},
		{
			name: "whiteKnight1",
			id: "g60695",
			square: "b1",
		},
		{
			name: "whiteRook1",
			id: "g3416",
			square: "a1",
		},

		{
			name: "whitePawn1",
			id: "path3444"
		},
		{
			name: "whitePawn2",
			id: "path3442"
		},
		{
			name: "whitePawn3",
			id: "path3440"
		},
		{
			name: "whitePawn4",
			id: "path3438"
		},
		{
			name: "whitePawn5",
			id: "path3436"
		},
		{
			name: "whitePawn6",
			id: "path3434"
		},
		{
			name: "whitePawn7",
			id: "path3432"
		},
		{
			name: "whitePawn8",
			id: "path2575"
		},


		{
			name: "blackRook1",
			id: "g46309"
		},
		{
			name: "blackKnight1",
			id: "g60728"
		},
		{
			name: "blackBishop1",
			id: "g63721"
		},
		{
			name: "blackKing",
			id: "g70004"
		},
		{
			name: "blackQueen",
			id: "g67023"
		},
		{
			name: "blackBishop2",
			id: "g63818"
		},
		{
			name: "blackKnight2",
			id: "g49858"
		},
		{
			name: "blackRook2",
			id: "g46345"
		},

		{
			name: "blackPawn1",
			id: "path3194"
		},
		{
			name: "blackPawn2",
			id: "path17042"
		},
		{
			name: "blackPawn3",
			id: "path17044"
		},

		{
			name: "blackPawn4",
			id: "path17046"
		},
		{
			name: "blackPawn5",
			id: "path17048"
		},
		{
			name: "blackPawn6",
			id: "path17050"
		},
		{
			name: "blackPawn7",
			id: "path17052"
		},
		{
			name: "blackPawn8",
			id: "path17054"
		},
	];

	this.move = {
		m1: "",
		m2: "",
	};

	this.click = function(square) {

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
			console.log(this.id + " Clicked! " 
				+ this + " " + evt.target);
			console.log(theBoard.squares2[this.id]);
			theBoard.click(theBoard.squares2[this.id]);
 		});
		rotateBoard();
		theBoard.placePiece("whiteKing", "e3");
		theBoard.placePiece("whiteBishop2", "e4");
		theBoard.placePiece("whiteKnight2", "e6");
	});
});
