package com.ludogame.app.models

data class GamePlayer(
    val id: PlayerColor,
    val tokens: List<GameToken>,
    val isActive: Boolean = true
) {
    constructor(color: PlayerColor, isActive: Boolean = true) : this(
        id = color,
        tokens = (0 until 4).map { GameToken(id = it, owner = color) },
        isActive = isActive
    )

    val finishedTokenCount: Int
        get() = tokens.count { it.isFinished }

    val hasWon: Boolean
        get() = finishedTokenCount == 4
}
