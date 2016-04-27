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
	
	// If the player's board was just built, add ships to it
    if(player == "player")
    {
      // Returns an array of strings, each string is a ship location on the board
      return generateAllShips();
    }
}

// Genearates five ships on the board by calling generate ship
// Returns an array of strings that are all the locations on the board with a ship
function generateAllShips()
{
  var locations = []

  locations = locations.concat(generateShip(2))
  locations = locations.concat(generateShip(3))
  locations = locations.concat(generateShip(3))
  locations = locations.concat(generateShip(4))
  locations = locations.concat(generateShip(5))

  return locations
}

function generateShip(size)
{
    // random if the ship is vertical or horizontal
    var vertical = Math.random() >= 0.5;
    // index of the ship that is changing
    var varyingIndex = Math.floor(Math.random() * 10) + 1
    // index of the ship that is staying the same
    var constantIndex = Math.floor(Math.random() * 10) + 1

    var count = 0
    var locationsToAdd = [];

    while (count < size)
    {
      varyingIndex = varyingIndex + 1

      if (vertical)
      {
          newShipLocation = [constantIndex, varyingIndex];
      }
      else
      {
          newShipLocation = [varyingIndex, constantIndex];
      }

      var goodLocation = true;
    
    
      // for each location on the board
      for (var x = 1; x <=10; x = x + 1) {
        for (var y = 1; y <=10; y = y + 1) {
          var currentTile = document.getElementById("player-grid-" + x + "-" + y)
          // if the current tile already has a ship on it and we're trying to add to that tile, it is a bad location
          if (newShipLocation[0] === x && newShipLocation[1] === y && currentTile.style.background === "rgb(128, 128, 128)")
          {
            goodLocation = false
          }
        }
      }

      // if the new location is out of bounds of the board, it is a bad location
      if (newShipLocation[0] < 1 || newShipLocation[0] > 10)
      {
        goodLocation = false
      }
      if (newShipLocation[1] < 1 || newShipLocation[1] > 10)
      {
        goodLocation = false
      }

      // if the new location is bad, start over and find a good location
      if(!goodLocation)
      {
        // Random number between 1 and 10
        varyingIndex = Math.floor(Math.random() * 10) + 1  

        // Random number between 1 and 10
        constantIndex = Math.floor(Math.random() * 10) + 1

        count = 0

        locationsToAdd = [];

        continue
      }
      // otherwise, push the new location onto the array of locations to be added
      else
      {
        locationsToAdd.push(newShipLocation)

        count = count + 1;
      }   

    }

    // keep track of each location added (to be returned)
    var locationsAdded = []

    // for each location to be added
    for (var i = 0; i < locationsToAdd.length; i++) 
    {
      var locationToAdd = locationsToAdd[i];
      var num1 = locationToAdd[0];
      var num2 = locationToAdd[1];

      locationsAdded.push(num1 + "-" + num2)

      // generate its id
      var idToColor = "player-grid-" + num1 + "-" + num2

      // get the element
      var toColor = document.getElementById(idToColor);
    
      // color the location
      toColor.style.background = "#808080";
    }

    // return all the new colored locations
    return locationsAdded
}

function fireShot(cell)
{
  var message = JSON.stringify({
    action : "fire",
    coord : cell.id.substring(14)
  });
  conn.send(message);
}

function hit(cell_id)
{
  
}
