import Foundation

struct GameToken: Identifiable, Equatable, Codable {
    let id: Int
    let owner: PlayerColor

    /// -1 = yard, 0...51 = main track, 52...57 = home stretch, 58 = finished
    var position: Int

    var isInYard: Bool { position < 0 }
    var isOnMainTrack: Bool { (0...51).contains(position) }
    var isInHomeStretch: Bool { (52...57).contains(position) }
    var isFinished: Bool { position >= 58 }

    init(id: Int, owner: PlayerColor) {
        self.id = id
        self.owner = owner
        self.position = -1
    }
}
