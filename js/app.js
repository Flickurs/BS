function start_game()
{
    var username = document.getElementById("username");
    conn = new Connection(name, "chatwindow", "uofu-cs4540-64.westus.cloudapp.azure.com:8080");
    var modal = document.getElementById("start_modal");
    modal.style.display = "none";

    var messagebox = document.getElementById("messagebox");

    messagebox.addEventListener('keypress', function(evt) {
        if (evt.keyCode != 13 || conn == undefined)
            return;

        evt.preventDefault();

        if (this.value == "")
            return;

        var message = {
            "action": "message",
            "message": this.value
        };

        conn.sendMsg(message);

        this.value = "";
    });
}
