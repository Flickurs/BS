function start_game()
{
    var username = document.getElementById("username").value;

    if (username == "")
    {
        $("#errorMsg").html("<br>Please enter a username.");
        $("#username").focus();
        return;
    }

    var player_board = buildNewBoard(11, 11, 35, "player");
    buildNewBoard(11, 11, 35, "opponent");
    conn = new Connection(username, "chatwindow", "uofu-cs4540-64.westus.cloudapp.azure.com:8080", player_board);
    var modal = document.getElementById("start_modal");
    modal.style.display = "none";

    var messagebox = document.getElementById("messagebox");

    messagebox.addEventListener('keypress', function(evt) {
        if (evt.keyCode != 13 || conn == undefined)
            return;

        evt.preventDefault();

        if (this.value == "")
            return;

        var message = JSON.stringify({
            action: "message",
            message: this.value
        });

        conn.send(message);

        this.value = "";
    });
}

$(function() {
    $("#username").keyup(function(event) {
        if(event.keyCode == 13) {
            start_game();
        }
    });
    $("#username").focus();
});