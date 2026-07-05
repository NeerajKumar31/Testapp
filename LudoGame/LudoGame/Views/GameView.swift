import SwiftUI

struct GameView: View {
    let playerCount: Int
    let onExit: () -> Void

    @StateObject private var viewModel: LudoViewModel

    init(playerCount: Int, onExit: @escaping () -> Void) {
        self.playerCount = playerCount
        self.onExit = onExit
        _viewModel = StateObject(wrappedValue: LudoViewModel(playerCount: playerCount))
    }

    var body: some View {
        ZStack {
            Color(red: 0.95, green: 0.96, blue: 0.98).ignoresSafeArea()

            VStack(spacing: 16) {
                header
                BoardView(
                    state: viewModel.state,
                    selectableTokenIDs: viewModel.state.selectableTokenIDs,
                    onTokenTap: viewModel.selectToken
                )
                .aspectRatio(1, contentMode: .fit)
                .padding(.horizontal, 12)

                statusBar
                diceSection
            }
            .padding(.vertical, 12)

            if let winner = viewModel.state.winner {
                WinnerView(winner: winner) {
                    viewModel.restart(playerCount: playerCount)
                } onExit: {
                    onExit()
                }
            }
        }
    }

    private var header: some View {
        HStack {
            Button("Exit", action: onExit)
                .font(.headline)
                .foregroundStyle(.secondary)

            Spacer()

            Text("Ludo")
                .font(.title2.bold())

            Spacer()

            HStack(spacing: 8) {
                ForEach(viewModel.state.players) { player in
                    Circle()
                        .fill(player.id.color)
                        .frame(width: 14, height: 14)
                        .overlay {
                            if player.id == viewModel.state.currentPlayer.id && viewModel.state.winner == nil {
                                Circle().stroke(.black.opacity(0.5), lineWidth: 2)
                            }
                        }
                        .opacity(player.hasWon ? 0.35 : 1)
                }
            }
        }
        .padding(.horizontal, 20)
    }

    private var statusBar: some View {
        Text(viewModel.state.statusMessage)
            .font(.subheadline.weight(.semibold))
            .multilineTextAlignment(.center)
            .foregroundStyle(.primary)
            .padding(.horizontal, 20)
            .frame(minHeight: 44)
    }

    private var diceSection: some View {
        VStack(spacing: 12) {
            DiceView(value: viewModel.displayedDiceValue, isRolling: viewModel.isAnimatingDice)

            Button {
                viewModel.rollDice()
            } label: {
                Text(viewModel.state.selectableTokenIDs.isEmpty ? "Roll Dice" : "Choose a Token")
                    .font(.headline)
                    .frame(width: 180)
                    .padding(.vertical, 14)
                    .background(buttonBackground, in: Capsule())
                    .foregroundStyle(.white)
            }
            .disabled(!canRoll)
        }
        .padding(.bottom, 8)
    }

    private var canRoll: Bool {
        viewModel.state.winner == nil &&
        !viewModel.isAnimatingDice &&
        viewModel.state.selectableTokenIDs.isEmpty
    }

    private var buttonBackground: Color {
        canRoll ? viewModel.state.currentPlayer.id.color : .gray.opacity(0.5)
    }
}

#Preview {
    GameView(playerCount: 4, onExit: {})
}
