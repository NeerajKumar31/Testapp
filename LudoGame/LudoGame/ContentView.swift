import SwiftUI

struct ContentView: View {
    @State private var playerCount = 4
    @State private var isPlaying = false

    var body: some View {
        Group {
            if isPlaying {
                GameView(playerCount: playerCount) {
                    isPlaying = false
                }
            } else {
                HomeView(playerCount: $playerCount) {
                    isPlaying = true
                }
            }
        }
        .preferredColorScheme(.light)
    }
}

#Preview {
    ContentView()
}
