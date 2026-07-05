package com.ludogame.app.ui.screens

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.ludogame.app.viewmodel.LudoViewModel

class LudoViewModelFactory(
    private val playerCount: Int
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(LudoViewModel::class.java)) {
            return LudoViewModel(playerCount) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
