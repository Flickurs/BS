function buildNewBoard(rows, cols, tileSize, player)
{
  var container;
  if(player == "player")
    container = document.getElementById("player_board");

  else
    container = document.getElementById("opponent_board");

	for(var y = 0; y < rows; y++)
	{
        var letter = String.fromCharCode('a'.charCodeAt(0) + y);
		for(var x = 0; x < cols; x++)
		{
			var tile = document.createElement("div");
			container.appendChild(tile);
			tile.id = "grid-" + x + "-" + y;

			tile.classList.add("tile");
      if(player == "opponent")
        tile.classList.add("tile-opponent");
			tile.style.top = (y*tileSize) + 'px';
			tile.style.left = (x*tileSize) + 'px';
			tile.style.width = tileSize + 'px';
			tile.style.height = tileSize + 'px';
		}
	}
}
