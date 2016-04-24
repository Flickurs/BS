function buildNewBoard(rows, cols, tileSize, player)
{
  var container;
  if(player == "player")
    container = document.getElementById("player_board");

  else
    container = document.getElementById("opponent_board");

	for(var y = 0; y < rows; y++)
	{
    var letter = String.fromCharCode('a'.charCodeAt(0) + y-1);
		for(var x = 0; x < cols; x++)
		{
			var tile = document.createElement("div");
			container.appendChild(tile);

      var id = "";
      if(player == "player") id += "player";
      else id += "opponent";
      id += "-grid-" + x + "-" + y;
			tile.id = id;
      
      if(x == 0 && y > 0)
      {
        var row_name = document.createElement("label");
        row_name.innerHTML = letter.toUpperCase();      
        tile.appendChild(row_name);
      }
      else if(y == 0 && x > 0)
      {
        var row_name = document.createElement("label");
        row_name.innerHTML = x;
        tile.appendChild(row_name);
      }
      else if(player == "opponent")
        tile.classList.add("tile-opponent");

      if(x == 0 || y == 0)
      {
        tile.classList.add("tile-label");
        tile.classList.remove("tile-opponent");
      }
      else if(player == "opponent")
      {
        tile.onclick = function() { fireShot(this); };
      }

			tile.classList.add("tile");   
			tile.style.top = (y*tileSize) + 'px';
			tile.style.left = (x*tileSize) + 'px';
			tile.style.width = tileSize + 'px';
			tile.style.height = tileSize + 'px';
		}
	}
}

function fireShot(cell)
{
  var message = JSON.stringify({
    action : "fire",
    coord : cell.id.substring(8)
  });
  this.onclick = null;
  conn.send(message);
  cell.classList.remove("tile-opponent");
  cell.style.background = "#b30000";
  cell.onclick = null;
}

function hit(cell_id)
{
  
}
