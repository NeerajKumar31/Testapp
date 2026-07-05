import Foundation
import SwiftUI

@MainActor
final class LudoViewModel: ObservableObject {
    @Published private(set) var state: LudoGameState
    @Published var displayedDiceValue: Int = 1
    @Published var isAnimatingDice = false

    private var engine: LudoGameEngine

    init(playerCount: Int = 4) {
        engine = LudoGameEngine(playerCount: playerCount)
        state = engine.state
    }

    func rollDice() {
        guard !isAnimatingDice,
              state.winner == nil,
              state.selectableTokenIDs.isEmpty else { return }

        isAnimatingDice = true
        Task {
            for _ in 0..<8 {
                displayedDiceValue = Int.random(in: 1...6)
                try? await Task.sleep(nanoseconds: 80_000_000)
            }
            engine.rollDice()
            if let roll = engine.state.lastDiceRoll {
                displayedDiceValue = roll
            }
            state = engine.state
            isAnimatingDice = false
        }
    }

    func selectToken(_ tokenID: Int) {
        engine.selectToken(tokenID)
        state = engine.state
    }

    func restart(playerCount: Int) {
        engine = LudoGameEngine(playerCount: playerCount)
        state = engine.state
        displayedDiceValue = 1
        isAnimatingDice = false
    }
}
