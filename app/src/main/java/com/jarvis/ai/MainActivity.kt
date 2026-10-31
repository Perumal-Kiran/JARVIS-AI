package com.jarvis.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val JarvisBlack = Color(0xFF08090C)
private val JarvisPanel = Color(0xFF15171D)
private val JarvisRed = Color(0xFFFF2638)
private val Muted = Color(0xFF9DA3AE)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                JarvisHome()
            }
        }
    }
}

@Composable
fun JarvisHome() {
    val pulse = rememberInfiniteTransition(label = "trianglePulse")
    val scale by pulse.animateFloat(
        initialValue = 0.96f,
        targetValue = 1.04f,
        animationSpec = infiniteRepeatable(
            animation = tween(1300, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseScale"
    )

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = JarvisBlack
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 28.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("J.A.R.V.I.S", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Text("SYSTEM ONLINE", color = JarvisRed, fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(Modifier.height(62.dp))
            Text("GOOD EVENING, SIR", color = Muted, fontSize = 12.sp, letterSpacing = 2.sp)
            Spacer(Modifier.height(24.dp))

            // A simple animated red triangle mark; voice and wake-word behaviour are added later.
            Box(
                modifier = Modifier
                    .size(190.dp)
                    .scale(scale),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "△",
                    color = JarvisRed,
                    fontSize = 176.sp,
                    fontWeight = FontWeight.Light
                )
            }

            Spacer(Modifier.height(14.dp))
            Text("AT YOUR SERVICE", color = Color.White, fontSize = 14.sp, letterSpacing = 3.sp)
            Spacer(Modifier.height(8.dp))
            Text("Voice interface is not connected yet", color = Muted, fontSize = 12.sp)

            Spacer(Modifier.weight(1f))
            Surface(
                color = JarvisPanel,
                shape = RoundedCornerShape(18.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(Modifier.padding(18.dp)) {
                    Text("QUICK ACCESS", color = Muted, fontSize = 10.sp, letterSpacing = 2.sp)
                    Spacer(Modifier.height(14.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        QuickItem("VOICE", "Coming next")
                        QuickItem("CALLS", "Setup next")
                        QuickItem("MEMORY", "Coming next")
                    }
                }
            }
            Spacer(Modifier.height(18.dp))
            Button(
                onClick = { /* Voice interaction will be connected in the next stage. */ },
                modifier = Modifier.fillMaxWidth().height(54.dp),
                colors = ButtonDefaults.buttonColors(containerColor = JarvisRed),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text("ACTIVATE JARVIS", color = Color.White, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(12.dp))
            Text("JARVIS AI  •  VERSION 0.1.0", color = Muted, fontSize = 10.sp)
        }
    }
}

@Composable
private fun QuickItem(title: String, subtitle: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(title, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(5.dp))
        Text(subtitle, color = Muted, fontSize = 9.sp)
    }
}
