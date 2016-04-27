<?php

namespace Chat\Game;

interface GameInterface
{
	public function handleMissle($conn, $coord);

	public function handleMessage($conn, $msg);

    public function handleDisconnect($conn);
}
