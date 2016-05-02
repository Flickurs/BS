<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Battleship README</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/style.css">
    <script src="js/Connection.js"></script>
</head>

<body>
    <div class="background-image background">
        <div class="background opaque">
        </div>
    </div>

    <nav class="navbar navbar-inverse">
        <div class="container-fluid">
            <div class="navbar-header">

                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <a class="navbar-brand" href="">Battleship README</a>
            </div>
            <div aria-expanded="false" id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-info-sign"></span> Info</a>
                        <ul class="dropdown-menu">
                            <li><a href="/Projects">Home</a></li>
                            <li><a href="./">Battleship</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class='col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3'>
        <div class='text-center'>
            <a href='https://github.com/Flickurs/BS' class='btn btn-success'>Repository</a>
        </div>
        <br>
        <div id='readme' class='opaque well'>
            <p>Herein lies Jake Anderson, Matthew Lemon, Michael Pregman, and Jackson Stafford's Final Project for CS 4540 Spring 2016. Game play follows normal Battleship patterns, though ships are randomly placed for each user. Additionally, there exists an in game chat window.</p>
        </div>
    </div>

</body>
</html>
