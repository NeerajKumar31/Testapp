package com.ludogame.app.ui.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.matchParentSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.Canvas
import androidx.compose.ui.geometry.Offset

@Composable
fun DiceView(
    value: Int,
    isRolling: Boolean,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "diceRoll")
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = if (isRolling) 18f else 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(80),
            repeatMode = RepeatMode.Reverse
        ),
        label = "diceRotation"
    )

    Box(
        modifier = modifier
            .size(72.dp)
            .rotate(if (isRolling) rotation else 0f)
            .shadow(8.dp, RoundedCornerShape(18.dp))
            .background(Color.White, RoundedCornerShape(18.dp))
    ) {
        Canvas(modifier = Modifier.matchParentSize()) {
            val dotRadius = size.minDimension * 0.08f
            dotPositions(value).forEach { point ->
                drawCircle(
                    color = Color.Black,
                    radius = dotRadius,
                    center = Offset(point.x * size.width, point.y * size.height)
                )
            }
        }
    }
}

private fun dotPositions(value: Int): List<Offset> {
    return when (value) {
        1 -> listOf(Offset(0.5f, 0.5f))
        2 -> listOf(Offset(0.25f, 0.25f), Offset(0.75f, 0.75f))
        3 -> listOf(Offset(0.25f, 0.25f), Offset(0.5f, 0.5f), Offset(0.75f, 0.75f))
        4 -> listOf(
            Offset(0.25f, 0.25f),
            Offset(0.75f, 0.25f),
            Offset(0.25f, 0.75f),
            Offset(0.75f, 0.75f)
        )
        5 -> listOf(
            Offset(0.25f, 0.25f),
            Offset(0.75f, 0.25f),
            Offset(0.5f, 0.5f),
            Offset(0.25f, 0.75f),
            Offset(0.75f, 0.75f)
        )
        6 -> listOf(
            Offset(0.25f, 0.22f),
            Offset(0.75f, 0.22f),
            Offset(0.25f, 0.5f),
            Offset(0.75f, 0.5f),
            Offset(0.25f, 0.78f),
            Offset(0.75f, 0.78f)
        )
        else -> emptyList()
    }
}
