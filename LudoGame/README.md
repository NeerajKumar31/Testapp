# Ludo — Native iOS Game

A classic Ludo board game built with **SwiftUI** for iPhone and iPad. Pass-and-play local multiplayer for 2–4 players on a single device.

## Features

- Native SwiftUI interface with animated dice and token movement
- 2, 3, or 4 player local multiplayer
- Classic rules: roll 6 to start, captures, safe zones, three-sixes skip, exact home entry
- Color-coded board with yard areas, outer track, home stretches, and center finish

## Requirements

- macOS with **Xcode 15+**
- iOS **17.0+** (iPhone or iPad simulator/device)

## Getting Started

1. Clone this repository.
2. Open `LudoGame/LudoGame.xcodeproj` in Xcode.
3. Select your development team under **Signing & Capabilities** for the `LudoGame` target.
4. Choose an iPhone simulator or connected device.
5. Press **Run** (⌘R).

## Project Structure

```
LudoGame/
├── LudoGame.xcodeproj
└── LudoGame/
    ├── LudoGameApp.swift       # App entry point
    ├── ContentView.swift       # Navigation between home and game
    ├── Models/                 # Player, token, and game state
    ├── Engine/                 # Board layout and game rules
    ├── ViewModels/             # Observable game controller
    └── Views/                  # SwiftUI screens and board
```

## How to Play

1. Choose the number of players on the home screen and tap **Start Game**.
2. On your turn, tap **Roll Dice**.
3. If multiple tokens can move, tap the highlighted token to move it.
4. Roll a **6** to move a token out of the yard (and roll again).
5. Land on an opponent's token (outside safe zones) to send it back to the yard.
6. Move all four tokens into the center to win.

## License

MIT
