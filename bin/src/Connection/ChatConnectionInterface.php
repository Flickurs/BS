<?php

namespace Chat\Connection;

interface ChatConnectionInterface
{
    public function getConnection();

    public function getName();

    public function setName($name);

    public function sendMsg($sender, $msg);

    public function setGame($g);

    public function startGame($opp, $t);

    public function sendResult($c, $h);

    public function sendTurn($c, $h);

    public function gameOver($user);

    public function setCoords($cs);

    public function getCoords();

    public function containsCoord($c);

    public function fire($c);

    public function isGameNull();

    public function message($msg);

    public function sendMessage($name, $msg);

    public function disconnect();

    public function sendDisconnect();
}
