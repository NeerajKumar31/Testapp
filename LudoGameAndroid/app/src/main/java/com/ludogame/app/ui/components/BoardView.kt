package com.ludogame.app.ui.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import com.ludogame.app.engine.LudoBoardLayout
import com.ludogame.app.models.BoardCorner
import com.ludogame.app.models.LudoGameState
import com.ludogame.app.models.PlayerColor
import kotlin.math.roundToInt

@Composable
fun BoardView(
    state: LudoGameState,
    selectableTokenIds: Set<Int>,
    onTokenTap: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    BoxWithConstraints(modifier = modifier) {
        val boardSize = minOf(maxWidth, maxHeight)

        Box(
            modifier = Modifier
                .size(boardSize)
                .align(Alignment.Center)
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val sizePx = size.minDimension
                val cornerRadius = sizePx * 0.04f

                drawRoundRect(
                    color = Color(0xFFEDEEF2),
                    cornerRadius = CornerRadius(cornerRadius, cornerRadius),
                    size = Size(sizePx, sizePx)
                )
                drawRoundRect(
                    color = Color.Black.copy(alpha = 0.08f),
                    cornerRadius = CornerRadius(cornerRadius, cornerRadius),
                    size = Size(sizePx, sizePx),
                    style = Stroke(width = 2f)
                )

                PlayerColor.allCases.forEach { color ->
                    val rect = homeRect(color.homeCorner, sizePx)
                    drawRoundRect(
                        color = color.lightColor,
                        topLeft = Offset(rect.left, rect.top),
                        size = Size(rect.width, rect.height),
                        cornerRadius = CornerRadius(sizePx * 0.02f, sizePx * 0.02f)
                    )
                    drawRoundRect(
                        color = color.composeColor.copy(alpha = 0.8f),
                        topLeft = Offset(rect.left, rect.top),
                        size = Size(rect.width, rect.height),
                        cornerRadius = CornerRadius(sizePx * 0.02f, sizePx * 0.02f),
                        style = Stroke(width = 2f)
                    )
                }

                repeat(LudoBoardLayout.PATH_LENGTH) { index ->
                    val point = LudoBoardLayout.coordinateAtAbsoluteTrackIndex(index)
                    val cellSize = sizePx * 0.055f
                    val isSafe = PlayerColor.safePositions.contains(index)
                    val topLeft = Offset(
                        x = point.x * sizePx - cellSize / 2f,
                        y = point.y * sizePx - cellSize / 2f
                    )

                    drawRoundRect(
                        color = if (isSafe) Color.White else Color.White.copy(alpha = 0.85f),
                        topLeft = topLeft,
                        size = Size(cellSize, cellSize),
                        cornerRadius = CornerRadius(3f, 3f)
                    )
                    drawRoundRect(
                        color = Color.Black.copy(alpha = 0.08f),
                        topLeft = topLeft,
                        size = Size(cellSize, cellSize),
                        cornerRadius = CornerRadius(3f, 3f),
                        style = Stroke(width = 1f)
                    )
                }

                val wedgeSize = sizePx * 0.22f
                PlayerColor.allCases.forEach { color ->
                    val rotation = when (color) {
                        PlayerColor.RED -> 135f
                        PlayerColor.GREEN -> 45f
                        PlayerColor.YELLOW -> -45f
                        PlayerColor.BLUE -> -135f
                    }
                    rotate(rotation, pivot = center) {
                        val path = Path().apply {
                            moveTo(center.x, center.y)
                            lineTo(center.x + wedgeSize / 2f, center.y - wedgeSize / 2f)
                            lineTo(center.x + wedgeSize / 2f, center.y + wedgeSize / 2f)
                            close()
                        }
                        drawPath(path, color.composeColor.copy(alpha = 0.85f))
                    }
                }

                drawCircle(
                    color = Color.White,
                    radius = sizePx * 0.04f,
                    center = center
                )
                drawCircle(
                    color = Color.Black.copy(alpha = 0.1f),
                    radius = sizePx * 0.04f,
                    center = center,
                    style = Stroke(width = 1f)
                )
            }

            state.players.forEach { player ->
                player.tokens.forEachIndexed { stackIndex, token ->
                    val point = LudoBoardLayout.coordinate(token, stackIndex)
                    val tokenSize = boardSize * 0.055f
                    val isSelectable = selectableTokenIds.contains(token.id) &&
                        player.id == state.currentPlayer.id

                    TokenView(
                        color = player.id,
                        isSelectable = isSelectable,
                        isCurrentPlayer = player.id == state.currentPlayer.id,
                        modifier = Modifier
                            .size(tokenSize)
                            .offset {
                                IntOffset(
                                    x = (point.x * boardSize.toPx() - tokenSize.toPx() / 2f).roundToInt(),
                                    y = (point.y * boardSize.toPx() - tokenSize.toPx() / 2f).roundToInt()
                                )
                            }
                            .then(
                                if (isSelectable) {
                                    Modifier.clickable { onTokenTap(token.id) }
                                } else {
                                    Modifier
                                }
                            )
                    )
                }
            }
        }
    }
}

@Composable
fun TokenView(
    color: PlayerColor,
    isSelectable: Boolean,
    isCurrentPlayer: Boolean,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "tokenPulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = if (isSelectable) 1.25f else 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(500),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseScale"
    )

    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .clip(CircleShape)
                .background(color.composeColor)
                .border(2.dp, Color.White, CircleShape)
        )

        if (isSelectable) {
            Box(
                modifier = Modifier
                    .fillMaxSize(pulseScale.coerceAtMost(1.3f))
                    .clip(CircleShape)
                    .border(3.dp, Color(0xFFFFD600), CircleShape)
            )
        }

        if (isCurrentPlayer) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .clip(CircleShape)
                    .border(1.dp, Color.Black.copy(alpha = 0.25f), CircleShape)
            )
        }
    }
}

private fun homeRect(corner: BoardCorner, size: Float): Rect {
    val side = size * 0.34f
    val inset = size * 0.02f
    return when (corner) {
        BoardCorner.BOTTOM_LEFT -> Rect(inset, size - side - inset, inset + side, size - inset)
        BoardCorner.TOP_LEFT -> Rect(inset, inset, inset + side, inset + side)
        BoardCorner.TOP_RIGHT -> Rect(size - side - inset, inset, size - inset, inset + side)
        BoardCorner.BOTTOM_RIGHT -> Rect(size - side - inset, size - side - inset, size - inset, size - inset)
    }
}
