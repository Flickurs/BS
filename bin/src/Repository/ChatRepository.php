<?php

namespace Chat\Repository;

use SplObjectStorage;
use SplQueue;
use Chat\Connection\ChatConnection;
use Chat\Game\Game;
use Ratchet\ConnectionInterface;

class ChatRepository implements ChatRepositoryInterface
{
    /**
     * All the connected clients
     *
     * @var SplObjectStorage
     */
    private $clients;
    private $queue;

    /**
     * ChatRepository Constructor
     */
    public function __construct()
    {
        $this->clients = new SplObjectStorage;
        $this->queue = new SplQueue;
    }

    /**
     * Get a client by their name
     *
     * @param string $name
     * @return ChatConnectionInterface
     */
    public function getClientByName($name)
    {
        foreach ($this->clients as $client)
        {
            if ($client->getName() === $name)
                return $client;
        }

        return null;
    }

    /**
     * Get a client by their connection
     *
     * @param ConnectionInterface $conn
     * @return ChatConnectionInterface
     */
    public function getClientByConnection(ConnectionInterface $conn)
    {
        foreach ($this->clients as $client)
        {
            if ($client->getConnection() === $conn)
            return $client;
        }

        return null;
    }

    /**
     * Add a client to the list
     *
     * @param ConnectionInterface $conn
     * @return void
     */
    public function addClient(ConnectionInterface $conn)
    {
        $newClient = new ChatConnection($conn, $this);
        $this->clients->attach($newClient);
        print("Client connected\n");
    }

    /**
     * Remove a client from the list
     *
     * @param ConnectionInterface $conn
     * @return void
     */
    public function removeClient(ConnectionInterface $conn)
    {
        $client = $this->getClientByConnection($conn);

        if ($client !== null)
        {
            print("Disconnecting: " . $client->getName() . "\n");
            $client->disconnect();
            $this->clients->detach($client);
        }
    }

    /**
     * Get all the connected clients
     *
     * @return SplObjectStorage
     */
    public function getClients()
    {
        return $this->clients;
    }

    public function enqueueClient(ChatConnection $client)
    {
        print("Client enqueued.\n");
        print("Queue count before: " . $this->queue->count() . "\n");
        $this->queue->enqueue($client);
        print("Queue count after: " . $this->queue->count() . "\n");
        while ($this->queue->count() >= 2)
        {
            $playerOne = $this->queue->dequeue();
            $playerTwo = $this->queue->dequeue();

            if ($this->getClientByConnection($playerOne->getConnection()) == null)
            {
                if ($this->getClientByConnection($playerTwo->getConnection()) != null)
                    $this->queue->enqueue($playerTwo);
                continue;
            }
            else if ($this->getClientByConnection($playerTwo->getConnection()) == null)
            {
                if ($this->getClientByConnection($playerOne->getConnection()) != null)
                    $this->queue->enqueue($playerOne);
                continue;
            }

            print("Creating game...\n");
            new Game($playerOne, $playerTwo);
        }
    }
}
