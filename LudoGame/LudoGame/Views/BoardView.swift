import SwiftUI

struct BoardView: View {
    let state: LudoGameState
    let selectableTokenIDs: Set<Int>
    let onTokenTap: (Int) -> Void

    var body: some View {
        GeometryReader { geo in
            let size = min(geo.size.width, geo.size.height)

            ZStack {
                boardBackground(size: size)
                pathCells(size: size)
                homeAreas(size: size)
                centerTriangle(size: size)
                tokensLayer(size: size)
            }
            .frame(width: size, height: size)
            .position(x: geo.size.width / 2, y: geo.size.height / 2)
        }
    }

    @ViewBuilder
    private func boardBackground(size: CGFloat) -> some View {
        RoundedRectangle(cornerRadius: size * 0.04)
            .fill(Color(red: 0.93, green: 0.94, blue: 0.96))
            .overlay(
                RoundedRectangle(cornerRadius: size * 0.04)
                    .stroke(Color.black.opacity(0.08), lineWidth: 2)
            )
    }

    @ViewBuilder
    private func homeAreas(size: CGFloat) -> some View {
        ForEach(PlayerColor.allCases) { color in
            homeArea(for: color, size: size)
        }
    }

    @ViewBuilder
    private func homeArea(for color: PlayerColor, size: CGFloat) -> some View {
        let rect = homeRect(for: color.homeCorner, size: size)
        RoundedRectangle(cornerRadius: size * 0.02)
            .fill(color.lightColor)
            .overlay(
                RoundedRectangle(cornerRadius: size * 0.02)
                    .stroke(color.color.opacity(0.8), lineWidth: 2)
            )
            .frame(width: rect.width, height: rect.height)
            .position(x: rect.midX, y: rect.midY)
    }

    @ViewBuilder
    private func pathCells(size: CGFloat) -> some View {
        ForEach(0..<LudoBoardLayout.pathLength, id: \.self) { index in
            let point = LudoBoardLayout.coordinate(atAbsoluteTrackIndex: index)
            let cellSize = size * 0.055
            let isSafe = PlayerColor.safePositions.contains(index)

            RoundedRectangle(cornerRadius: 3)
                .fill(isSafe ? Color.white : Color.white.opacity(0.85))
                .overlay(
                    RoundedRectangle(cornerRadius: 3)
                        .stroke(Color.black.opacity(0.08), lineWidth: 1)
                )
                .overlay {
                    if isSafe {
                        Image(systemName: "star.fill")
                            .font(.system(size: cellSize * 0.35))
                            .foregroundStyle(Color.orange.opacity(0.8))
                    }
                }
                .frame(width: cellSize, height: cellSize)
                .position(x: point.x * size, y: point.y * size)
        }
    }

    @ViewBuilder
    private func centerTriangle(size: CGFloat) -> some View {
        ZStack {
            ForEach(PlayerColor.allCases) { color in
                TriangleWedge()
                    .fill(color.color.opacity(0.85))
                    .frame(width: size * 0.22, height: size * 0.22)
                    .rotationEffect(rotation(for: color))
            }

            Circle()
                .fill(Color.white)
                .frame(width: size * 0.08, height: size * 0.08)
                .overlay(Circle().stroke(Color.black.opacity(0.1), lineWidth: 1))
        }
        .position(x: size * 0.5, y: size * 0.5)
    }

    @ViewBuilder
    private func tokensLayer(size: CGFloat) -> some View {
        ForEach(state.players) { player in
            ForEach(Array(player.tokens.enumerated()), id: \.element.id) { stackIndex, token in
                let point = LudoBoardLayout.coordinate(for: token, stackIndex: stackIndex)
                let tokenSize = size * 0.055
                let isSelectable = selectableTokenIDs.contains(token.id) && player.id == state.currentPlayer.id

                Button {
                    if isSelectable {
                        onTokenTap(token.id)
                    }
                } label: {
                    TokenView(
                        color: player.id,
                        isSelectable: isSelectable,
                        isCurrentPlayer: player.id == state.currentPlayer.id
                    )
                    .frame(width: tokenSize, height: tokenSize)
                }
                .buttonStyle(.plain)
                .disabled(!isSelectable)
                .position(x: point.x * size, y: point.y * size)
                .animation(.spring(response: 0.35, dampingFraction: 0.8), value: token.position)
            }
        }
    }

    private func homeRect(for corner: BoardCorner, size: CGFloat) -> CGRect {
        let side = size * 0.34
        switch corner {
        case .bottomLeft:
            return CGRect(x: size * 0.02, y: size - side - size * 0.02, width: side, height: side)
        case .topLeft:
            return CGRect(x: size * 0.02, y: size * 0.02, width: side, height: side)
        case .topRight:
            return CGRect(x: size - side - size * 0.02, y: size * 0.02, width: side, height: side)
        case .bottomRight:
            return CGRect(x: size - side - size * 0.02, y: size - side - size * 0.02, width: side, height: side)
        }
    }

    private func rotation(for color: PlayerColor) -> Angle {
        switch color {
        case .red: return .degrees(135)
        case .green: return .degrees(45)
        case .yellow: return .degrees(-45)
        case .blue: return .degrees(-135)
        }
    }
}

private struct TriangleWedge: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.midY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

#Preview {
    BoardView(
        state: LudoGameState(playerCount: 4),
        selectableTokenIDs: [],
        onTokenTap: { _ in }
    )
    .padding()
}
