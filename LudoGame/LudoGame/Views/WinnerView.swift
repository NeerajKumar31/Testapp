import SwiftUI

struct WinnerView: View {
    let winner: PlayerColor
    let onPlayAgain: () -> Void
    let onExit: () -> Void

    var body: some View {
        ZStack {
            Color.black.opacity(0.45).ignoresSafeArea()

            VStack(spacing: 20) {
                Image(systemName: "trophy.fill")
                    .font(.system(size: 56))
                    .foregroundStyle(.yellow)

                Text("\(winner.displayName) Wins!")
                    .font(.largeTitle.bold())

                Text("All four tokens reached home.")
                    .foregroundStyle(.secondary)

                HStack(spacing: 12) {
                    Button("Play Again", action: onPlayAgain)
                        .buttonStyle(PrimaryButtonStyle(color: winner.color))

                    Button("Main Menu", action: onExit)
                        .buttonStyle(SecondaryButtonStyle())
                }
                .padding(.top, 8)
            }
            .padding(28)
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 24))
            .padding(32)
        }
    }
}

private struct PrimaryButtonStyle: ButtonStyle {
    let color: Color

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(color, in: Capsule())
            .foregroundStyle(.white)
            .opacity(configuration.isPressed ? 0.85 : 1)
    }
}

private struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(Color.secondary.opacity(0.15), in: Capsule())
            .opacity(configuration.isPressed ? 0.85 : 1)
    }
}

#Preview {
    WinnerView(winner: .red, onPlayAgain: {}, onExit: {})
}
