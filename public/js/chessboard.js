$(document).ready( function () {

 $.get("AAA_SVG_Chessboard_and_chess_pieces_06.svg", function(data) {
	 $("#middle").html(data.documentElement);

	$("svg", data.documentElement).get(0).currentScale = .40;
 	$("rect", data.documentElement).click(this, function (evt) {

		$.get("chess/move/" + this.id);
		console.log(this.id + " Clicked! " + this + " " + evt.target);

		/*
		var transform = $("svg", 
			data.documentElement).get(0).createSVGTransform();

		transform.setTranslate(0, 150);
		var transformList = evt.target.transform.baseVal;
		var t = transformList.consolidate();
		if (transformList.numberOfItems == 0) {
			transformList.appendItem(transform);
		} else {
			transformList.replaceItem(transform, 0);
		}
		*/
 	});
	});
});
