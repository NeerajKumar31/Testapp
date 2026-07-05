package com.ludogame.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.border
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ludogame.app.ui.components.BoardView
import com.ludogame.app.ui.components.DiceView
import com.ludogame.app.ui.components.WinnerOverlay
import com.ludogame.app.viewmodel.LudoViewModel

@Composable
fun GameScreen(
    playerCount: Int,
    onExit: () -> Unit,
    viewModel: LudoViewModel = viewModel(
        factory = LudoViewModelFactory(playerCount)
    )
) {
    val state by viewModel.state.collectAsState()
    val displayedDiceValue by viewModel.displayedDiceValue.collectAsState()
    val isAnimatingDice by viewModel.isAnimatingDice.collectAsState()

    val canRoll = state.winner == null &&
        !isAnimatingDice &&
        state.selectableTokenIDs.isEmpty()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF2F4F8))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(vertical = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                TextButton(onClick = onExit) {
                    Text(text = "Exit", color = Color.Gray)
                }

                Spacer(modifier = Modifier.weight(1f))

                Text(
                    text = "Ludo",
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.weight(1f))

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    state.players.forEach { player ->
                        Box(
                            modifier = Modifier
                                .size(14.dp)
                                .clip(CircleShape)
                                .background(
                                    player.id.composeColor.copy(
                                        alpha = if (player.hasWon) 0.35f else 1f
                                    )
                                )
                                .then(
                                    if (player.id == state.currentPlayer.id && state.winner == null) {
                                        Modifier.border(2.dp, Color.Black.copy(alpha = 0.5f), CircleShape)
                                    } else {
                                        Modifier
                                    }
                                )
                        )
                    }
                }
            }

            BoardView(
                state = state,
                selectableTokenIds = state.selectableTokenIDs,
                onTokenTap = viewModel::selectToken,
                modifier = Modifier
                    .padding(horizontal = 12.dp)
                    .fillMaxWidth()
                    .aspectRatio(1f)
            )

            Text(
                text = state.statusMessage,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
                    .height(44.dp),
                textAlign = TextAlign.Center,
                fontWeight = FontWeight.SemiBold
            )

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                DiceView(
                    value = displayedDiceValue,
                    isRolling = isAnimatingDice
                )

                Button(
                    onClick = viewModel::rollDice,
                    enabled = canRoll,
                    modifier = Modifier.width(180.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (canRoll) {
                            state.currentPlayer.id.composeColor
                        } else {
                            Color.Gray.copy(alpha = 0.5f)
                        },
                        disabledContainerColor = Color.Gray.copy(alpha = 0.5f)
                    )
                ) {
                    Text(
                        text = if (state.selectableTokenIDs.isEmpty()) "Roll Dice" else "Choose a Token"
                    )
                }
            }
        }

        state.winner?.let { winner ->
            WinnerOverlay(
                winner = winner,
                onPlayAgain = { viewModel.restart(playerCount) },
                onExit = onExit
            )
        }
    }
}
