import CoreGraphics
import Foundation

/// Maps logical board positions to normalized coordinates (0...1).
enum LudoBoardLayout {
    static let pathLength = 52
    static let homeStretchLength = 6

    /// Outer track cell centers, indexed 0...51 clockwise from red's start.
    static let mainTrack: [CGPoint] = {
        let inset: CGFloat = 0.18
        let end: CGFloat = 1.0 - inset
        let span = end - inset

        return (0..<pathLength).map { index in
            let side = index / 13
            let step = index % 13
            let t = CGFloat(step) / 12.0

            switch side {
            case 0:
                return CGPoint(x: inset + span * t, y: end)
            case 1:
                return CGPoint(x: end, y: end - span * t)
            case 2:
                return CGPoint(x: end - span * t, y: inset)
            default:
                return CGPoint(x: inset, y: inset + span * t)
            }
        }
    }()

    static func absoluteTrackIndex(for token: GameToken) -> Int? {
        guard token.isOnMainTrack else { return nil }
        return (token.owner.startPosition + token.position) % pathLength
    }

    static func coordinate(for token: GameToken, stackIndex: Int = 0) -> CGPoint {
        if token.isInYard {
            return yardCoordinate(for: token.owner, tokenID: token.id)
        }
        if token.isFinished {
            return centerCoordinate
        }
        if token.isInHomeStretch {
            return homeStretchCoordinate(for: token.owner, step: token.position - pathLength, stackIndex: stackIndex)
        }
        if let absolute = absoluteTrackIndex(for: token) {
            return offset(point: mainTrack[absolute], stackIndex: stackIndex)
        }
        return centerCoordinate
    }

    static func coordinate(atAbsoluteTrackIndex index: Int) -> CGPoint {
        mainTrack[index % pathLength]
    }

    static var centerCoordinate: CGPoint {
        CGPoint(x: 0.5, y: 0.5)
    }

    static func yardCoordinate(for color: PlayerColor, tokenID: Int) -> CGPoint {
        let base: CGPoint
        switch color.homeCorner {
        case .bottomLeft: base = CGPoint(x: 0.09, y: 0.91)
        case .topLeft: base = CGPoint(x: 0.09, y: 0.09)
        case .topRight: base = CGPoint(x: 0.91, y: 0.09)
        case .bottomRight: base = CGPoint(x: 0.91, y: 0.91)
        }
        let offsets: [CGPoint] = [
            CGPoint(x: -0.03, y: -0.03),
            CGPoint(x: 0.03, y: -0.03),
            CGPoint(x: -0.03, y: 0.03),
            CGPoint(x: 0.03, y: 0.03)
        ]
        return CGPoint(x: base.x + offsets[tokenID].x, y: base.y + offsets[tokenID].y)
    }

    private static func homeStretchCoordinate(for color: PlayerColor, step: Int, stackIndex: Int) -> CGPoint {
        let clampedStep = min(max(step, 0), homeStretchLength)
        let t = CGFloat(clampedStep + 1) / CGFloat(homeStretchLength + 2)
        let start = color.homeCorner.entryPoint
        let end = centerCoordinate
        let point = CGPoint(
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t
        )
        return offset(point: point, stackIndex: stackIndex)
    }

    private static func offset(point: CGPoint, stackIndex: Int) -> CGPoint {
        let angle = CGFloat(stackIndex) * .pi / 2
        let radius: CGFloat = 0.012
        return CGPoint(
            x: point.x + cos(angle) * radius,
            y: point.y + sin(angle) * radius
        )
    }
}

private extension BoardCorner {
    var entryPoint: CGPoint {
        switch self {
        case .bottomLeft: return CGPoint(x: 0.38, y: 0.62)
        case .topLeft: return CGPoint(x: 0.38, y: 0.38)
        case .topRight: return CGPoint(x: 0.62, y: 0.38)
        case .bottomRight: return CGPoint(x: 0.62, y: 0.62)
        }
    }
}
