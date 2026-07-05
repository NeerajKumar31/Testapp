# Ludo — Native Android Game

A classic Ludo board game built with **Kotlin** and **Jetpack Compose** for local pass-and-play multiplayer (2–4 players on one device).

## Features

- Material 3 Compose UI with animated dice and token movement
- 2, 3, or 4 player local multiplayer
- Classic rules: roll 6 to start, captures, safe zones, three-sixes skip, exact home entry
- Color-coded board with yard areas, outer track, home stretches, and center finish

## Requirements

- **Android Studio Hedgehog (2023.1.1)+** or newer
- **JDK 17**
- Android **7.0+** (API 24) device or emulator

## Getting Started

1. Clone this repository.
2. Open the `LudoGameAndroid` folder in Android Studio.
3. Let Gradle sync complete (Android Studio will download the Gradle wrapper if needed).
4. Select a device or emulator.
5. Click **Run**.

From the command line (with Android SDK configured):

```bash
cd LudoGameAndroid
./gradlew assembleDebug
```

## Project Structure

```
LudoGameAndroid/
├── app/
│   └── src/main/java/com/ludogame/app/
│       ├── MainActivity.kt
│       ├── models/          # Player, token, game state
│       ├── engine/          # Board layout and game rules
│       ├── viewmodel/       # Game controller
│       └── ui/
│           ├── screens/     # Home and game screens
│           └── components/  # Board, dice, tokens
└── build.gradle.kts
```

## How to Play

1. Choose the number of players on the home screen and tap **Start Game**.
2. On your turn, tap **Roll Dice**.
3. If multiple tokens can move, tap the highlighted token.
4. Roll a **6** to move a token out of the yard (and roll again).
5. Land on an opponent's token (outside safe zones) to send it back to the yard.
6. Move all four tokens into the center to win.

## iOS Version

See the companion iOS app in the `LudoGame/` directory.

## License

MIT
