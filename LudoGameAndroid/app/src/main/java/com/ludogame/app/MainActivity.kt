package com.ludogame.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.ludogame.app.ui.screens.GameScreen
import com.ludogame.app.ui.screens.HomeScreen
import com.ludogame.app.ui.theme.LudoGameTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            LudoGameTheme {
                var isPlaying by rememberSaveable { mutableStateOf(false) }
                var playerCount by rememberSaveable { mutableIntStateOf(4) }

                if (isPlaying) {
                    GameScreen(
                        playerCount = playerCount,
                        onExit = { isPlaying = false }
                    )
                } else {
                    HomeScreen(
                        playerCount = playerCount,
                        onPlayerCountChange = { playerCount = it },
                        onStart = { isPlaying = true }
                    )
                }
            }
        }
    }
}
