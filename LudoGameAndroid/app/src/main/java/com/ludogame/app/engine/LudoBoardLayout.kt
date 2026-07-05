package com.ludogame.app.engine

import androidx.compose.ui.geometry.Offset
import com.ludogame.app.models.BoardCorner
import com.ludogame.app.models.GameToken
import com.ludogame.app.models.PlayerColor
import kotlin.math.cos
import kotlin.math.sin

object LudoBoardLayout {
    const val PATH_LENGTH = 52
    const val HOME_STRETCH_LENGTH = 6

    val mainTrack: List<Offset> = run {
        val inset = 0.18f
        val end = 1.0f - inset
        val span = end - inset

        (0 until PATH_LENGTH).map { index ->
            val side = index / 13
            val step = index % 13
            val t = step / 12f

            when (side) {
                0 -> Offset(inset + span * t, end)
                1 -> Offset(end, end - span * t)
                2 -> Offset(end - span * t, inset)
                else -> Offset(inset, inset + span * t)
            }
        }
    }

    val centerCoordinate = Offset(0.5f, 0.5f)

    fun absoluteTrackIndex(token: GameToken): Int? {
        if (!token.isOnMainTrack) return null
        return (token.owner.startPosition + token.position) % PATH_LENGTH
    }

    fun coordinate(token: GameToken, stackIndex: Int = 0): Offset {
        return when {
            token.isInYard -> yardCoordinate(token.owner, token.id)
            token.isFinished -> centerCoordinate
            token.isInHomeStretch -> homeStretchCoordinate(
                token.owner,
                token.position - PATH_LENGTH,
                stackIndex
            )
            else -> {
                val absolute = absoluteTrackIndex(token)
                if (absolute != null) {
                    offset(mainTrack[absolute], stackIndex)
                } else {
                    centerCoordinate
                }
            }
        }
    }

    fun coordinateAtAbsoluteTrackIndex(index: Int): Offset {
        return mainTrack[index % PATH_LENGTH]
    }

    fun yardCoordinate(color: PlayerColor, tokenId: Int): Offset {
        val base = when (color.homeCorner) {
            BoardCorner.BOTTOM_LEFT -> Offset(0.09f, 0.91f)
            BoardCorner.TOP_LEFT -> Offset(0.09f, 0.09f)
            BoardCorner.TOP_RIGHT -> Offset(0.91f, 0.09f)
            BoardCorner.BOTTOM_RIGHT -> Offset(0.91f, 0.91f)
        }
        val offsets = listOf(
            Offset(-0.03f, -0.03f),
            Offset(0.03f, -0.03f),
            Offset(-0.03f, 0.03f),
            Offset(0.03f, 0.03f)
        )
        val offset = offsets[tokenId]
        return Offset(base.x + offset.x, base.y + offset.y)
    }

    private fun homeStretchCoordinate(color: PlayerColor, step: Int, stackIndex: Int): Offset {
        val clampedStep = step.coerceIn(0, HOME_STRETCH_LENGTH)
        val t = (clampedStep + 1).toFloat() / (HOME_STRETCH_LENGTH + 2)
        val start = color.homeCorner.entryPoint
        val end = centerCoordinate
        val point = Offset(
            x = start.x + (end.x - start.x) * t,
            y = start.y + (end.y - start.y) * t
        )
        return offset(point, stackIndex)
    }

    private fun offset(point: Offset, stackIndex: Int): Offset {
        val angle = stackIndex * Math.PI.toFloat() / 2f
        val radius = 0.012f
        return Offset(
            x = point.x + cos(angle) * radius,
            y = point.y + sin(angle) * radius
        )
    }

    private val BoardCorner.entryPoint: Offset
        get() = when (this) {
            BoardCorner.BOTTOM_LEFT -> Offset(0.38f, 0.62f)
            BoardCorner.TOP_LEFT -> Offset(0.38f, 0.38f)
            BoardCorner.TOP_RIGHT -> Offset(0.62f, 0.38f)
            BoardCorner.BOTTOM_RIGHT -> Offset(0.62f, 0.62f)
        }
}
