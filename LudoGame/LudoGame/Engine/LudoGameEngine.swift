import Foundation

struct LudoGameEngine {
    private(set) var state: LudoGameState

    init(playerCount: Int = 4) {
        state = LudoGameState(playerCount: min(max(playerCount, 2), 4))
    }

    mutating func rollDice() {
        guard state.winner == nil, !state.isRolling else { return }
        guard state.selectableTokenIDs.isEmpty else { return }

        state.isRolling = true
        let roll = Int.random(in: 1...6)
        state.lastDiceRoll = roll

        if roll == 6 {
            state.consecutiveSixes += 1
        } else {
            state.consecutiveSixes = 0
        }

        if state.consecutiveSixes >= 3 {
            state.statusMessage = "\(state.currentPlayer.id.displayName) rolled three 6s — turn skipped"
            state.consecutiveSixes = 0
            state.isRolling = false
            advanceTurn(extraTurn: false)
            return
        }

        let movable = movableTokens(for: state.currentPlayer.id, dice: roll)
        if movable.isEmpty {
            state.statusMessage = "\(state.currentPlayer.id.displayName) rolled \(roll) — no valid moves"
            state.isRolling = false
            advanceTurn(extraTurn: roll == 6)
            return
        }

        if movable.count == 1, let only = movable.first {
            state.statusMessage = "\(state.currentPlayer.id.displayName) rolled \(roll)"
            moveToken(only, dice: roll)
            return
        }

        state.selectableTokenIDs = Set(movable)
        state.statusMessage = "\(state.currentPlayer.id.displayName) rolled \(roll) — choose a token"
        state.isRolling = false
    }

    mutating func selectToken(_ tokenID: Int) {
        guard state.selectableTokenIDs.contains(tokenID),
              let dice = state.lastDiceRoll else { return }

        state.selectableTokenIDs.removeAll()
        moveToken(tokenID, dice: dice)
    }

    private mutating func moveToken(_ tokenID: Int, dice: Int) {
        guard let playerIndex = state.players.firstIndex(where: { $0.id == state.currentPlayer.id }),
              let tokenIndex = state.players[playerIndex].tokens.firstIndex(where: { $0.id == tokenID }) else {
            return
        }

        var token = state.players[playerIndex].tokens[tokenIndex]
        let previousAbsolute = LudoBoardLayout.absoluteTrackIndex(for: token)
        let captured = applyMove(to: &token, dice: dice)
        state.players[playerIndex].tokens[tokenIndex] = token

        if state.players[playerIndex].hasWon {
            state.winner = state.players[playerIndex].id
            state.statusMessage = "\(state.winner!.displayName) wins!"
            state.isRolling = false
            return
        }

        let extraTurn = dice == 6 || captured
        if captured {
            state.statusMessage = "\(state.currentPlayer.id.displayName) captured a token!"
        } else if token.isFinished {
            state.statusMessage = "\(state.currentPlayer.id.displayName) reached home!"
        } else {
            state.statusMessage = "\(state.currentPlayer.id.displayName) moved token \(tokenID + 1)"
        }

        _ = previousAbsolute
        state.isRolling = false
        advanceTurn(extraTurn: extraTurn)
    }

    private mutating func applyMove(to token: inout GameToken, dice: Int) -> Bool {
        if token.isInYard {
            guard dice == 6 else { return false }
            token.position = 0
            return captureIfNeeded(at: token)
        }

        if token.isOnMainTrack {
            let newPosition = token.position + dice
            if newPosition > LudoBoardLayout.pathLength - 1 {
                let overflow = newPosition - (LudoBoardLayout.pathLength - 1)
                if overflow > LudoBoardLayout.homeStretchLength {
                    return false
                }
                token.position = LudoBoardLayout.pathLength - 1 + overflow
                return false
            }
            token.position = newPosition
            return captureIfNeeded(at: token)
        }

        if token.isInHomeStretch {
            let homeIndex = token.position - LudoBoardLayout.pathLength + 1
            let newHomeIndex = homeIndex + dice
            if newHomeIndex > LudoBoardLayout.homeStretchLength {
                return false
            }
            if newHomeIndex == LudoBoardLayout.homeStretchLength {
                token.position = 58
            } else {
                token.position = LudoBoardLayout.pathLength - 1 + newHomeIndex
            }
            return false
        }

        return false
    }

    private mutating func captureIfNeeded(at token: GameToken) -> Bool {
        guard token.isOnMainTrack,
              let absolute = LudoBoardLayout.absoluteTrackIndex(for: token),
              !PlayerColor.safePositions.contains(absolute) else {
            return false
        }

        var captured = false
        for playerIndex in state.players.indices {
            guard state.players[playerIndex].id != token.owner else { continue }
            for tokenIndex in state.players[playerIndex].tokens.indices {
                var opponent = state.players[playerIndex].tokens[tokenIndex]
                guard opponent.isOnMainTrack,
                      let opponentAbsolute = LudoBoardLayout.absoluteTrackIndex(for: opponent),
                      opponentAbsolute == absolute else { continue }
                opponent.position = -1
                state.players[playerIndex].tokens[tokenIndex] = opponent
                captured = true
            }
        }
        return captured
    }

    private mutating func advanceTurn(extraTurn: Bool) {
        state.lastDiceRoll = nil
        state.selectableTokenIDs.removeAll()

        guard state.winner == nil else { return }
        guard !extraTurn else {
            state.statusMessage += " — roll again!"
            return
        }

        repeat {
            state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.count
        } while !state.players[state.currentPlayerIndex].isActive || state.players[state.currentPlayerIndex].hasWon
    }

    private func movableTokens(for player: PlayerColor, dice: Int) -> [Int] {
        guard let gamePlayer = state.players.first(where: { $0.id == player }) else { return [] }
        return gamePlayer.tokens.compactMap { token in
            canMove(token, dice: dice) ? token.id : nil
        }
    }

    private func canMove(_ token: GameToken, dice: Int) -> Bool {
        if token.isFinished { return false }
        if token.isInYard { return dice == 6 }

        if token.isOnMainTrack {
            let newPosition = token.position + dice
            if newPosition > LudoBoardLayout.pathLength - 1 {
                let overflow = newPosition - (LudoBoardLayout.pathLength - 1)
                return overflow <= LudoBoardLayout.homeStretchLength
            }
            return true
        }

        if token.isInHomeStretch {
            let homeIndex = token.position - LudoBoardLayout.pathLength + 1
            return homeIndex + dice <= LudoBoardLayout.homeStretchLength
        }

        return false
    }
}
