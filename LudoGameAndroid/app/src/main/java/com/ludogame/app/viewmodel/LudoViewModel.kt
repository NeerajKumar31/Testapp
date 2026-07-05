package com.ludogame.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ludogame.app.engine.LudoGameEngine
import com.ludogame.app.models.LudoGameState
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlin.random.Random

class LudoViewModel(playerCount: Int) : ViewModel() {
    private var engine = LudoGameEngine(playerCount)

    private val _state = MutableStateFlow(engine.state)
    val state: StateFlow<LudoGameState> = _state.asStateFlow()

    private val _displayedDiceValue = MutableStateFlow(1)
    val displayedDiceValue: StateFlow<Int> = _displayedDiceValue.asStateFlow()

    private val _isAnimatingDice = MutableStateFlow(false)
    val isAnimatingDice: StateFlow<Boolean> = _isAnimatingDice.asStateFlow()

    fun rollDice() {
        val current = _state.value
        if (_isAnimatingDice.value || current.winner != null || current.selectableTokenIDs.isNotEmpty()) {
            return
        }

        viewModelScope.launch {
            _isAnimatingDice.value = true
            repeat(8) {
                _displayedDiceValue.value = Random.nextInt(1, 7)
                delay(80)
            }
            engine.rollDice()
            engine.state.lastDiceRoll?.let { _displayedDiceValue.value = it }
            _state.value = engine.state
            _isAnimatingDice.value = false
        }
    }

    fun selectToken(tokenId: Int) {
        engine.selectToken(tokenId)
        _state.value = engine.state
    }

    fun restart(playerCount: Int) {
        engine.restart(playerCount)
        _state.value = engine.state
        _displayedDiceValue.value = 1
        _isAnimatingDice.value = false
    }
}
