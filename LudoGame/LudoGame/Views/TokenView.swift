import SwiftUI

struct TokenView: View {
    let color: PlayerColor
    let isSelectable: Bool
    let isCurrentPlayer: Bool

    var body: some View {
        ZStack {
            Circle()
                .fill(color.color)
                .overlay(Circle().stroke(.white, lineWidth: 2))
                .shadow(color: .black.opacity(0.25), radius: 2, y: 1)

            Circle()
                .stroke(isSelectable ? Color.yellow : .clear, lineWidth: 3)
                .scaleEffect(isSelectable ? 1.25 : 1)
                .animation(.easeInOut(duration: 0.5).repeatForever(autoreverses: true), value: isSelectable)

            if isCurrentPlayer {
                Circle()
                    .stroke(.black.opacity(0.25), lineWidth: 1)
            }
        }
    }
}

#Preview {
    TokenView(color: .red, isSelectable: true, isCurrentPlayer: true)
        .frame(width: 28, height: 28)
        .padding()
}
