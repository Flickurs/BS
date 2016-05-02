<?php

namespace Chat\Connection;

use Chat\Repository\ChatRepositoryInterface;
use Chat\Game\GameInterface;
use Ratchet\ConnectionInterface;

class ChatConnection implements ChatConnectionInterface
{
    /**
     * The ConnectionInterface instance
     *
     * @var ConnectionInterface
     */
    private $connection;

    /**
     * The username of this connection
     *
     * @var string
     */
    private $name;

    /**
     * The ChatRepositoryInterface instance
     *
     * @var ChatRepositoryInterface
     */
    private $repository;

    private $game;
    private $coords;

    /**
     * ChatConnection Constructor
     *
     * @param ConnectionInterface     $conn
     * @param ChatRepositoryInterface $repository
     * @param string                  $name
     */
    public function __construct(ConnectionInterface $conn, ChatRepositoryInterface $repository, $name = "")
    {
        $this->connection = $conn;
        $this->name = $name;
        $this->repository = $repository;
    }

    /**
     * Sends a message through the socket
     *
     * @param string $sender
     * @param string $msg
     * @return void
     */
    public function sendMsg($sender, $msg)
    {
        $this->send([
            'action'   => 'message',
            'username' => $sender,
            'msg'      => $msg
        ]);
    }

    /**
     * Get the connection instance
     *
     * @return ConnectionInterface
     */
    public function getConnection()
    {
        return $this->connection;
    }

    /**
     * Set the name for this connection
     *
     * @param string $name
     * @return void
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * Get the username of the connection
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Send data through the socket
     *
     * @param  array  $data
     * @return void
     */
    private function send(array $data)
    {
        $this->connection->send(json_encode($data));
    }

    public function setGame($g)
    {
        $this->game = $g;
    }

    public function startGame($opp, $t)
    {
        $this->send([
            'action'   => 'start',
            'opponent' => $opp,
            'turn'     => $t
        ]);
    }

    public function sendResult($c, $h)
    {
        $this->send([
            'action'  => 'result',
            'coord'   => $c,
            'hit'     => $h
        ]);
    }

    public function sendTurn($c, $h)
    {
        $this->send([
            'action'  => 'turn',
            'coord'   => $c,
            'hit'     => $h
        ]);
    }

    public function gameOver($user)
    {
        // print("GAMEOVER\n");
        $this->send([
            'action'  => 'game_over',
            'winner'   => $user
        ]);
    }

    public function setCoords($cs)
    {
        // print("Coords: \n");
        // foreach ($cs as $c)
        //     print($c . "\n");

        $this->coords = $cs;
    }

    public function getCoords()
    {
        return $this->coords;
    }

    public function containsCoord($c)
    {
        return in_array($c, $this->coords);
    }

    public function fire($c)
    {
        $this->game->handleMissle($this, $c);
    }

    public function isGameNull()
    {
        return $this->game == null;
    }

    public function message($msg)
    {
        $this->game->handleMessage($this, $msg);
    }

    public function sendMessage($name, $msg)
    {
        $this->send([
            'action'  => 'message',
            'message' => $msg,
            'name'    => $name
        ]);
    }

    public function disconnect()
    {
        if ($this->game != null)
            $this->game->handleDisconnect($this);

        $this->game = null;
    }

    public function sendDisconnect()
    {
        $this->send([
            'action'  => 'user_disconnect'
        ]);
    }
}
