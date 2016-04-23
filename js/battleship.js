function buildNewBoard(rows, cols, tileSize)
{
	var container = document.getElementById("game_board");

	for(var y = 0; y < rows; y++)
	{
  		for(var x = 0; x < cols; x++)
  		{
  			var tile = document.createElement("div");
  			container.appendChild(tile);
  			tile.id = "player-" + x + "-" + y;

  			tile.classList.add("tile");
  			tile.style.top = (y*tileSize) + 'px';
  			tile.style.left = (x*tileSize) + 'px';
  			tile.style.width = tileSize + 'px';
  			tile.style.height = tileSize + 'px';
  		}
	}
}