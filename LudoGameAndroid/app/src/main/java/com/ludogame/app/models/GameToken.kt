package com.ludogame.app.models

data class GameToken(
    val id: Int,
    val owner: PlayerColor,
    val position: Int = -1
) {
    val isInYard: Boolean get() = position < 0
    val isOnMainTrack: Boolean get() = position in 0..51
    val isInHomeStretch: Boolean get() = position in 52..57
    val isFinished: Boolean get() = position >= 58
}
