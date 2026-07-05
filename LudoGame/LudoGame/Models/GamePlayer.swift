import Foundation

struct GamePlayer: Identifiable, Equatable, Codable {
    let id: PlayerColor
    var tokens: [GameToken]
    var isActive: Bool

    init(color: PlayerColor, isActive: Bool = true) {
        self.id = color
        self.isActive = isActive
        self.tokens = (0..<4).map { GameToken(id: $0, owner: color) }
    }

    var finishedTokenCount: Int {
        tokens.filter(\.isFinished).count
    }

    var hasWon: Bool {
        finishedTokenCount == 4
    }
}
