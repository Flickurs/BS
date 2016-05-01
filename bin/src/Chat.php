<?php

namespace Chat;

use Chat\Repository\ChatRepository;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface
{
    /**
     * The chat repository
     *
     * @var ChatRepository
     */
    protected $repository;

    /**
     * Chat Constructor
     */
    public function __construct()
    {
        $this->repository = new ChatRepository;
    }

    /**
     * Called when a connection is opened
     *
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onOpen(ConnectionInterface $conn)
    {
        $this->repository->addClient($conn);
    }

    /**
     * Called when a message is sent through the socket
     *
     * @param ConnectionInterface $conn
     * @param string              $msg
     * @return void
     */
    public function onMessage(ConnectionInterface $conn, $msg)
    {
        // Parse the json
        $data = $this->parseMessage($msg);
        $currClient = $this->repository->getClientByConnection($conn);

        // Distinguish between the actions
        if ($data->action === "fire")
        {
            if ($currClient->isGameNull())
            {
                print("This bitch, " . $currClient->getName() . ", trying to play off turn.\n");
                return;
            }

            $currClient->fire($data->coord);
        }
        else if ($data->action === "message")
        {
            if (!$currClient->isGameNull())
                $currClient->message($data->message);
        }
        else if ($data->action === "start")
        {
            print("Client start request.\n");
            $currClient->setName($data->username);
            $currClient->setCoords($data->coords);
            $this->repository->enqueueClient($currClient);
        }
    }

    /**
     * Parse raw string data
     *
     * @param string $msg
     * @return stdClass
     */
    private function parseMessage($msg)
    {
        return json_decode($msg);
    }

    /**
     * Called when a connection is closed
     *
     * @param ConnectionInterface $conn
     * @return void
     */
    public function onClose(ConnectionInterface $conn)
    {
        $this->repository->removeClient($conn);
    }

    /**
     * Called when an error occurs on a connection
     *
     * @param ConnectionInterface $conn
     * @param Exception           $e
     * @return void
     */
    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "The following error occured: " . $e->getMessage();

        $client = $this->repository->getClientByConnection($conn);

        // We want to fully close the connection
        if ($client !== null)
        {
            $client->getConnection()->close();
            $this->repository->removeClient($conn);
        }
    }
}
