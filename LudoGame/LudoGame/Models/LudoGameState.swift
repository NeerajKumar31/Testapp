import Foundation

struct LudoGameState: Equatable, Codable {
    var players: [GamePlayer]
    var currentPlayerIndex: Int
    var lastDiceRoll: Int?
    var consecutiveSixes: Int
    var selectableTokenIDs: Set<Int>
    var statusMessage: String
    var winner: PlayerColor?
    var isRolling: Bool

    init(playerCount: Int) {
        let colors = Array(PlayerColor.allCases.prefix(playerCount))
        self.players = colors.map { GamePlayer(color: $0) }
        self.currentPlayerIndex = 0
        self.lastDiceRoll = nil
        self.consecutiveSixes = 0
        self.selectableTokenIDs = []
        self.statusMessage = "Roll the dice to begin"
        self.winner = nil
        self.isRolling = false
    }

    var currentPlayer: GamePlayer {
        players[currentPlayerIndex]
    }

    var activePlayers: [GamePlayer] {
        players.filter(\.isActive)
    }
}
