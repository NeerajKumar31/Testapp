import SwiftUI

struct HomeView: View {
    @Binding var playerCount: Int
    let onStart: () -> Void

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(red: 0.10, green: 0.14, blue: 0.30), Color(red: 0.20, green: 0.28, blue: 0.52)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 28) {
                Spacer()

                VStack(spacing: 8) {
                    Text("Ludo")
                        .font(.system(size: 56, weight: .black, design: .rounded))
                        .foregroundStyle(.white)

                    Text("Classic board game for 2–4 players")
                        .font(.title3.weight(.medium))
                        .foregroundStyle(.white.opacity(0.85))
                }

                VStack(alignment: .leading, spacing: 16) {
                    Text("Players")
                        .font(.headline)
                        .foregroundStyle(.white.opacity(0.9))

                    Picker("Players", selection: $playerCount) {
                        Text("2 Players").tag(2)
                        Text("3 Players").tag(3)
                        Text("4 Players").tag(4)
                    }
                    .pickerStyle(.segmented)
                }
                .padding(20)
                .background(.white.opacity(0.12), in: RoundedRectangle(cornerRadius: 20))

                HStack(spacing: 12) {
                    ForEach(Array(PlayerColor.allCases.prefix(playerCount))) { color in
                        Circle()
                            .fill(color.color)
                            .frame(width: 28, height: 28)
                            .overlay(Circle().stroke(.white.opacity(0.8), lineWidth: 2))
                    }
                }

                Button(action: onStart) {
                    Text("Start Game")
                        .font(.title2.bold())
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(.white, in: RoundedRectangle(cornerRadius: 16))
                        .foregroundStyle(Color(red: 0.10, green: 0.14, blue: 0.30))
                }
                .padding(.top, 8)

                VStack(alignment: .leading, spacing: 8) {
                    ruleRow("Roll a 6 to leave the yard")
                    ruleRow("Land on opponents to send them home")
                    ruleRow("Reach the center with all four tokens to win")
                }
                .padding(20)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(.white.opacity(0.08), in: RoundedRectangle(cornerRadius: 20))

                Spacer()
            }
            .padding(24)
        }
    }

    private func ruleRow(_ text: String) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(.white.opacity(0.85))
            Text(text)
                .foregroundStyle(.white.opacity(0.9))
                .font(.subheadline)
        }
    }
}

#Preview {
    HomeView(playerCount: .constant(4), onStart: {})
}
