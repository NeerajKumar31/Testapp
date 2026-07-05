import SwiftUI

struct DiceView: View {
    let value: Int
    let isRolling: Bool

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(.white)
                .shadow(color: .black.opacity(0.12), radius: 8, y: 4)
                .frame(width: 72, height: 72)

            DiceFace(value: value)
                .padding(14)
        }
        .rotation3DEffect(.degrees(isRolling ? 18 : 0), axis: (x: 1, y: 1, z: 0))
        .animation(isRolling ? .easeInOut(duration: 0.08).repeatForever(autoreverses: true) : .default, value: isRolling)
    }
}

private struct DiceFace: View {
    let value: Int

    var body: some View {
        GeometryReader { geo in
            let dot = min(geo.size.width, geo.size.height) * 0.16
            ZStack {
                ForEach(dotPositions(for: value), id: \.self) { point in
                    Circle()
                        .fill(Color.primary)
                        .frame(width: dot, height: dot)
                        .position(
                            x: point.x * geo.size.width,
                            y: point.y * geo.size.height
                        )
                }
            }
        }
    }

    private func dotPositions(for value: Int) -> [CGPoint] {
        switch value {
        case 1: return [CGPoint(x: 0.5, y: 0.5)]
        case 2: return [CGPoint(x: 0.25, y: 0.25), CGPoint(x: 0.75, y: 0.75)]
        case 3: return [CGPoint(x: 0.25, y: 0.25), CGPoint(x: 0.5, y: 0.5), CGPoint(x: 0.75, y: 0.75)]
        case 4: return [CGPoint(x: 0.25, y: 0.25), CGPoint(x: 0.75, y: 0.25), CGPoint(x: 0.25, y: 0.75), CGPoint(x: 0.75, y: 0.75)]
        case 5: return [CGPoint(x: 0.25, y: 0.25), CGPoint(x: 0.75, y: 0.25), CGPoint(x: 0.5, y: 0.5), CGPoint(x: 0.25, y: 0.75), CGPoint(x: 0.75, y: 0.75)]
        case 6: return [CGPoint(x: 0.25, y: 0.22), CGPoint(x: 0.75, y: 0.22), CGPoint(x: 0.25, y: 0.5), CGPoint(x: 0.75, y: 0.5), CGPoint(x: 0.25, y: 0.78), CGPoint(x: 0.75, y: 0.78)]
        default: return []
        }
    }
}

#Preview {
    DiceView(value: 6, isRolling: false)
}
