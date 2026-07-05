package com.ludogame.app.models

data class LudoGameState(
    val players: List<GamePlayer>,
    val currentPlayerIndex: Int = 0,
    val lastDiceRoll: Int? = null,
    val consecutiveSixes: Int = 0,
    val selectableTokenIDs: Set<Int> = emptySet(),
    val statusMessage: String = "Roll the dice to begin",
    val winner: PlayerColor? = null,
    val isRolling: Boolean = false
) {
    constructor(playerCount: Int) : this(
        players = PlayerColor.allCases.take(playerCount.coerceIn(2, 4)).map { GamePlayer(it) }
    )

    val currentPlayer: GamePlayer
        get() = players[currentPlayerIndex]
}
