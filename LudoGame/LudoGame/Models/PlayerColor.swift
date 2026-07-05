import SwiftUI

enum PlayerColor: String, CaseIterable, Identifiable, Codable {
    case red, green, yellow, blue

    var id: String { rawValue }

    var displayName: String {
        rawValue.capitalized
    }

    var color: Color {
        switch self {
        case .red: return Color(red: 0.86, green: 0.15, blue: 0.15)
        case .green: return Color(red: 0.13, green: 0.70, blue: 0.32)
        case .yellow: return Color(red: 0.98, green: 0.78, blue: 0.08)
        case .blue: return Color(red: 0.12, green: 0.47, blue: 0.95)
        }
    }

    var lightColor: Color {
        color.opacity(0.35)
    }

    /// Entry cell on the shared outer track (clockwise from red).
    var startPosition: Int {
        switch self {
        case .red: return 0
        case .green: return 13
        case .yellow: return 26
        case .blue: return 39
        }
    }

    /// Board corner used for yard placement and home column direction.
    var homeCorner: BoardCorner {
        switch self {
        case .red: return .bottomLeft
        case .green: return .topLeft
        case .yellow: return .topRight
        case .blue: return .bottomRight
        }
    }

    static let safePositions: Set<Int> = [0, 8, 13, 21, 26, 34, 39, 47]
}

enum BoardCorner {
    case topLeft, topRight, bottomLeft, bottomRight
}
