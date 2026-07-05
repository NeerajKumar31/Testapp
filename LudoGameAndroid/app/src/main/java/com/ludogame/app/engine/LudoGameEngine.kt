package com.ludogame.app.engine

import com.ludogame.app.models.GameToken
import com.ludogame.app.models.LudoGameState
import com.ludogame.app.models.PlayerColor
import kotlin.random.Random

class LudoGameEngine(playerCount: Int = 4) {
    var state: LudoGameState = LudoGameState(playerCount)
        private set

    fun rollDice() {
        val current = state
        if (current.winner != null || current.isRolling) return
        if (current.selectableTokenIDs.isNotEmpty()) return

        state = current.copy(isRolling = true)
        val roll = Random.nextInt(1, 7)
        val consecutiveSixes = if (roll == 6) current.consecutiveSixes + 1 else 0

        if (consecutiveSixes >= 3) {
            state = state.copy(
                consecutiveSixes = 0,
                isRolling = false,
                statusMessage = "${current.currentPlayer.id.displayName} rolled three 6s — turn skipped"
            )
            advanceTurn(extraTurn = false)
            return
        }

        val movable = movableTokens(current.currentPlayer.id, roll)
        if (movable.isEmpty()) {
            state = state.copy(
                lastDiceRoll = roll,
                consecutiveSixes = consecutiveSixes,
                isRolling = false,
                statusMessage = "${current.currentPlayer.id.displayName} rolled $roll — no valid moves"
            )
            advanceTurn(extraTurn = roll == 6)
            return
        }

        if (movable.size == 1) {
            state = state.copy(
                lastDiceRoll = roll,
                consecutiveSixes = consecutiveSixes,
                statusMessage = "${current.currentPlayer.id.displayName} rolled $roll"
            )
            moveToken(movable.first(), roll)
            return
        }

        state = state.copy(
            lastDiceRoll = roll,
            consecutiveSixes = consecutiveSixes,
            selectableTokenIDs = movable.toSet(),
            statusMessage = "${current.currentPlayer.id.displayName} rolled $roll — choose a token",
            isRolling = false
        )
    }

    fun selectToken(tokenId: Int) {
        val current = state
        if (!current.selectableTokenIDs.contains(tokenId)) return
        val dice = current.lastDiceRoll ?: return

        state = current.copy(selectableTokenIDs = emptySet())
        moveToken(tokenId, dice)
    }

    private fun moveToken(tokenId: Int, dice: Int) {
        val current = state
        val playerIndex = current.players.indexOfFirst { it.id == current.currentPlayer.id }
        if (playerIndex < 0) return

        val player = current.players[playerIndex]
        val tokenIndex = player.tokens.indexOfFirst { it.id == tokenId }
        if (tokenIndex < 0) return

        val token = player.tokens[tokenIndex]
        val (updatedToken, captured) = applyMove(token, dice)
        val updatedTokens = player.tokens.toMutableList().apply { this[tokenIndex] = updatedToken }
        val updatedPlayer = player.copy(tokens = updatedTokens)
        val updatedPlayers = current.players.toMutableList().apply { this[playerIndex] = updatedPlayer }

        if (updatedPlayer.hasWon) {
            state = current.copy(
                players = updatedPlayers,
                winner = updatedPlayer.id,
                statusMessage = "${updatedPlayer.id.displayName} wins!",
                isRolling = false
            )
            return
        }

        val extraTurn = dice == 6 || captured
        val statusMessage = when {
            captured -> "${current.currentPlayer.id.displayName} captured a token!"
            updatedToken.isFinished -> "${current.currentPlayer.id.displayName} reached home!"
            else -> "${current.currentPlayer.id.displayName} moved token ${tokenId + 1}"
        }

        state = current.copy(
            players = updatedPlayers,
            statusMessage = statusMessage,
            isRolling = false
        )
        advanceTurn(extraTurn = extraTurn)
    }

    private fun applyMove(token: GameToken, dice: Int): Pair<GameToken, Boolean> {
        return when {
            token.isInYard -> {
                if (dice != 6) return token to false
                val moved = token.copy(position = 0)
                moved to captureIfNeeded(moved)
            }
            token.isOnMainTrack -> {
                val newPosition = token.position + dice
                if (newPosition > LudoBoardLayout.PATH_LENGTH - 1) {
                    val overflow = newPosition - (LudoBoardLayout.PATH_LENGTH - 1)
                    if (overflow > LudoBoardLayout.HOME_STRETCH_LENGTH) {
                        return token to false
                    }
                    val moved = token.copy(position = LudoBoardLayout.PATH_LENGTH - 1 + overflow)
                    return moved to false
                }
                val moved = token.copy(position = newPosition)
                moved to captureIfNeeded(moved)
            }
            token.isInHomeStretch -> {
                val homeIndex = token.position - LudoBoardLayout.PATH_LENGTH + 1
                val newHomeIndex = homeIndex + dice
                if (newHomeIndex > LudoBoardLayout.HOME_STRETCH_LENGTH) {
                    return token to false
                }
                val newPosition = if (newHomeIndex == LudoBoardLayout.HOME_STRETCH_LENGTH) {
                    58
                } else {
                    LudoBoardLayout.PATH_LENGTH - 1 + newHomeIndex
                }
                token.copy(position = newPosition) to false
            }
            else -> token to false
        }
    }

    private fun captureIfNeeded(token: GameToken): Boolean {
        if (!token.isOnMainTrack) return false
        val absolute = LudoBoardLayout.absoluteTrackIndex(token) ?: return false
        if (PlayerColor.safePositions.contains(absolute)) return false

        var captured = false
        val updatedPlayers = state.players.map { player ->
            if (player.id == token.owner) return@map player

            val updatedTokens = player.tokens.map { opponent ->
                if (!opponent.isOnMainTrack) return@map opponent
                val opponentAbsolute = LudoBoardLayout.absoluteTrackIndex(opponent) ?: return@map opponent
                if (opponentAbsolute == absolute) {
                    captured = true
                    opponent.copy(position = -1)
                } else {
                    opponent
                }
            }
            player.copy(tokens = updatedTokens)
        }

        if (captured) {
            state = state.copy(players = updatedPlayers)
        }
        return captured
    }

    private fun advanceTurn(extraTurn: Boolean) {
        val current = state
        state = current.copy(
            lastDiceRoll = null,
            selectableTokenIDs = emptySet()
        )

        if (state.winner != null) return
        if (extraTurn) {
            state = state.copy(statusMessage = "${state.statusMessage} — roll again!")
            return
        }

        var nextIndex = state.currentPlayerIndex
        do {
            nextIndex = (nextIndex + 1) % state.players.size
        } while (!state.players[nextIndex].isActive || state.players[nextIndex].hasWon)

        state = state.copy(currentPlayerIndex = nextIndex)
    }

    private fun movableTokens(player: PlayerColor, dice: Int): List<Int> {
        val gamePlayer = state.players.firstOrNull { it.id == player } ?: return emptyList()
        return gamePlayer.tokens.filter { canMove(it, dice) }.map { it.id }
    }

    private fun canMove(token: GameToken, dice: Int): Boolean {
        if (token.isFinished) return false
        if (token.isInYard) return dice == 6

        if (token.isOnMainTrack) {
            val newPosition = token.position + dice
            if (newPosition > LudoBoardLayout.PATH_LENGTH - 1) {
                val overflow = newPosition - (LudoBoardLayout.PATH_LENGTH - 1)
                return overflow <= LudoBoardLayout.HOME_STRETCH_LENGTH
            }
            return true
        }

        if (token.isInHomeStretch) {
            val homeIndex = token.position - LudoBoardLayout.PATH_LENGTH + 1
            return homeIndex + dice <= LudoBoardLayout.HOME_STRETCH_LENGTH
        }

        return false
    }

    fun restart(playerCount: Int) {
        state = LudoGameState(playerCount.coerceIn(2, 4))
    }
}
