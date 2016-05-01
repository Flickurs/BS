var Connection = (function() {

    function Connection(username, chatWindowId, url, board) {
        this.username = username;
        this.board = board;
        this.chatwindow = document.getElementById(chatWindowId);

        this.open = false;
        this.canFire = false;
        this.opponent = "Player 2";
        this.socket = new WebSocket("ws://" + url);
        console.log("Connected");
        this.setupConnectionEvents();
    }

    Connection.prototype = {

        userReady: function() {
            this.socket.send(JSON.stringify({
                action: "start",
                username: this.username,
                coords: this.board
            }));
        },

        addChatMessage: function(name, msg) {
            this.chatwindow.innerHTML += name + ': ' + msg + '&#13;&#10;';
            this.chatwindow.scrollTop = this.chatwindow.scrollHeight;
        },

        addSystemMessage: function(msg) {
            this.chatwindow.innerHTML += msg + '&#13;&#10;';
            this.chatwindow.scrollTop = this.chatwindow.scrollHeight;
        },

        setupConnectionEvents: function() {
            var self = this;

            self.socket.onopen = function(evt) { self.connectionOpen(evt); };
            self.socket.onmessage = function(evt) { self.connectionMessage(evt); };
            self.socket.onclose = function(evt) { self.connectionClose(evt); };
        },

        connectionOpen: function(evt) {
            this.open = true;
            this.addSystemMessage("Connected");
            this.userReady();
        },

        connectionMessage: function(evt) {
            if (!this.open)
                return;

            var data = JSON.parse(evt.data);

            if(data.action == "start")
            {
                this.canFire = true;
                this.addSystemMessage("Opponent has connected: " + data.opponent);
                this.opponent = data.opponent;
                if(data.turn)
                {
                    this.addSystemMessage("Your turn!");
                }
                else
                {
                    this.addSystemMessage("Wait for opponents turn...");
                }
            }
            else if(data.action == "result")
            {
                var tile = document.getElementById("opponent-grid-" + data.coord);
                if(data.hit)
                {
                    tile.style.background = "#b30000";
                }
                else
                {
                    tile.style.background = "white";
                }
                tile.onclick = null;
                tile.classList.remove("tile-opponent");
                this.addSystemMessage("Wait for opponents turn...");
            }
            else if(data.action == "turn")
            {
                this.addSystemMessage("Your turn!");
                var tile = document.getElementById("player-grid-" + data.coord);
                if(data.hit)
                {
                    tile.style.background = "#b30000";
                }
                else
                {
                    tile.style.background = "white";
                }
            }
            else if(data.action == "message")
            {
                this.addChatMessage(data.name, data.message);
            }
            else if(data.action == "game_over")
            {
                this.canFire = false;
                this.addSystemMessage("GAME OVER!")
                this.addSystemMessage(data.winner + " Is the WINNER!");
            }
            else if(data.action == "user_disconnect")
            {
                this.addSystemMessage(this.opponent + " disconnected...");
                this.connectionClose();
            }


        },

        connectionClose: function(evt) {
            this.open = false;
            this.addSystemMessage("Disconnected");
        },

        sendMsg: function(message) {
            if (this.open) {
                this.socket.send(JSON.stringify({
                    action: 'message',
                    msg: message
                }));

                this.addChatMessage(this.username, message);
            } else {
                this.addSystemMessage("You are not connected to the server.");
            }
        },

        send: function(message)
        {
            if(this.open)
            {
                this.socket.send(message);
            }
        }
    };

    return Connection;

})();
