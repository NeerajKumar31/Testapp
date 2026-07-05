package com.ludogame.app.models

import androidx.compose.ui.graphics.Color

enum class BoardCorner {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
}

enum class PlayerColor(val displayName: String) {
    RED("Red"),
    GREEN("Green"),
    YELLOW("Yellow"),
    BLUE("Blue");

    val composeColor: Color
        get() = when (this) {
            RED -> Color(0xFFDB2626)
            GREEN -> Color(0xFF21B352)
            YELLOW -> Color(0xFFFAC714)
            BLUE -> Color(0xFF1F78F2)
        }

    val lightColor: Color
        get() = composeColor.copy(alpha = 0.35f)

    val startPosition: Int
        get() = when (this) {
            RED -> 0
            GREEN -> 13
            YELLOW -> 26
            BLUE -> 39
        }

    val homeCorner: BoardCorner
        get() = when (this) {
            RED -> BoardCorner.BOTTOM_LEFT
            GREEN -> BoardCorner.TOP_LEFT
            YELLOW -> BoardCorner.TOP_RIGHT
            BLUE -> BoardCorner.BOTTOM_RIGHT
        }

    companion object {
        val allCases = entries
        val safePositions = setOf(0, 8, 13, 21, 26, 34, 39, 47)
    }
}
