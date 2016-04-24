var Connection = (function() {

    function Connection(username, chatWindowId, url, board) {
        this.username = username;
        this.board = board;
        this.chatwindow = document.getElementById(chatWindowId);

        this.open = false;

        this.socket = new WebSocket("ws://" + url);
        this.setupConnectionEvents();
    }

    Connection.prototype = {

        userReady: function() {
            this.socket.send(JSON.stringify({
                action: "start",
                username: this.username,
                coords: [ "4-1", "5-1"]
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
                this.addSystemMessage("Opponent has connected: " + data.opponent);
                this.addSystemMessage("Your turn: " + data.turn);
            }
            else if(data.action == "result")
            {
                var tile = document.getElementById("opponent-" + data.coord);
                if(data.hit == "true")
                    tile.style.background = "red";
                else
                    tile.style.background = "white";
            }
            else if(data.action == "turn")
            {

            }
            else if(data.action == "game_over")
            {

            }

            // if (data.action == 'setname') {
            //     if (data.success)
            //         this.addSystemMessage("Set username to " + this.username);
            //     else
            //         this.addSystemMessage("Username " + this.username + " has been taken.");
            // } else if (data.action == 'message') {
            //     this.addChatMessage(data.username, data.msg);
            // }
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
