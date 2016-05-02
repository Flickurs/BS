<?php

namespace Chat\Game;

use Chat\Connection\ChatConnection;

class Game implements GameInterface
{
    private $playerOneConn;
    private $playerTwoConn;
    private $playerOneHitsLeft;
    private $playerTwoHitsLeft;
    private $turn;

    public function __construct($pOneConn, $pTwoConn)
    {
        $this->turn = 1;
        $this->playerOneConn = $pOneConn;
        $this->playerTwoConn = $pTwoConn;
        $this->playerOneHitsLeft = count($pTwoConn->getCoords());
        $this->playerTwoHitsLeft = count($pOneConn->getCoords());
        $this->playerOneConn->setGame($this);
        $this->playerTwoConn->setGame($this);
        $this->playerOneConn->startGame($this->playerTwoConn->getName(), true);
        $this->playerTwoConn->startGame($this->playerOneConn->getName(), false);
    }

    public function handleMissle($conn, $coord)
    {
        // print("handling missle " . $coord . "\n");
        if($conn == $this->playerOneConn && $this->turn == 1)
        {
            $hit = $this->playerTwoConn->containsCoord($coord);

            // if($hit)
            //     print("HIT!\n");
            // print("P1 hits left: " . $this->playerOneHitsLeft . "\n");

            if($hit)
                $this->playerOneHitsLeft -= 1;

            // print("P1 hits left: " . $this->playerOneHitsLeft . "\n");

            $this->playerOneConn->sendResult($coord, $hit);
            $this->playerTwoConn->sendTurn($coord, $hit);
            $this->turn = 2;

            if($this->playerOneHitsLeft == 0)
            {
                $name = $this->playerOneConn->getName();
                $this->playerOneConn->gameOver($name);
                $this->playerTwoConn->gameOver($name);
            }
        }
        else if($conn == $this->playerTwoConn && $this->turn == 2)
        {
            $hit = $this->playerOneConn->containsCoord($coord);

            // if($hit)
            //     print("HIT!\n");
            // print("P2 hits left: " . $this->playerTwoHitsLeft . "\n");

            if($hit)
                $this->playerTwoHitsLeft -= 1;

            // print("P2 hits left: " . $this->playerTwoHitsLeft . "\n");

            $this->playerTwoConn->sendResult($coord, $hit);
            $this->playerOneConn->sendTurn($coord, $hit);
            $this->turn = 1;

            if($this->playerTwoHitsLeft == 0)
            {
                $name = $this->playerTwoConn->getName();
                $this->playerTwoConn->gameOver($name);
                $this->playerOneConn->gameOver($name);
            }
        }
    }

    public function handleMessage($conn, $msg)
    {
        $name = "";
        if ($conn == $this->playerOneConn)
            $name = $this->playerOneConn->getName();
        else
            $name = $this->playerTwoConn->getName();

        $this->playerOneConn->sendMessage($name, $msg);
        $this->playerTwoConn->sendMessage($name, $msg);
    }

    public function handleDisconnect($conn)
    {
        if ($conn == $this->playerOneConn)
        {
            $this->playerOneConn = null;

            if ($this->playerTwoConn != null)
            {
                $this->playerTwoConn->sendDisconnect();
                $this->playerTwoConn->disconnect();
            }
        }
        else if ($conn == $this->playerTwoConn)
        {
            $this->playerTwoConn = null;

            if ($this->playerOneConn != null)
            {
                $this->playerOneConn->sendDisconnect();
                $this->playerOneConn->disconnect();
            }
        }
    }
}