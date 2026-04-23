interface PlantDisplayProps {
  stage: number
  species?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_PX = { sm: 32, md: 64, lg: 80 } as const

// ── palette ─────────────────────────────────────────────────────────────────
const C = {
  soil:       '#7a5c4a',
  pot:        '#c8956a',
  potBorder:  '#3d2b1f',
  stem:       '#5a8a3c',
  leafDark:   '#3d6b28',
  budLight:   '#7ab648',
  petalWhite: '#fff8f0',
  petalPink:  '#e8a0b4',
  center:     '#f5c842',
  transparent: 'none',
} as const

type Color = typeof C[keyof typeof C]

// Helper: emit a <rect> at grid position (col, row), each cell = 1×1 in the 16×16 viewBox
function px(x: number, y: number, w: number, h: number, fill: Color) {
  return <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill={fill} />
}

// ── shared parts ─────────────────────────────────────────────────────────────
function Pot() {
  return (
    <>
      {/* pot body */}
      {px(4, 11, 8, 3, C.pot)}
      {/* pot rim */}
      {px(3, 10, 10, 1, C.pot)}
      {/* pot border */}
      {px(3, 10, 10, 1, C.potBorder)}
      {px(4, 11, 1, 3, C.potBorder)}
      {px(11, 11, 1, 3, C.potBorder)}
      {px(4, 13, 8, 1, C.potBorder)}
      {/* soil */}
      {px(2, 14, 12, 1, C.soil)}
    </>
  )
}

function Stem(topRow: number) {
  const rects = []
  for (let row = topRow; row <= 9; row++) {
    rects.push(px(7, row, 2, 1, C.stem))
  }
  return <>{rects}</>
}

function Leaves() {
  return (
    <>
      {/* left leaf */}
      {px(5, 7, 2, 2, C.stem)}
      {/* right leaf */}
      {px(9, 7, 2, 2, C.stem)}
    </>
  )
}

// ── stages ───────────────────────────────────────────────────────────────────
function Stage1() {
  return (
    <>
      <Pot />
      {/* seed barely poking out */}
      {px(7, 10, 2, 1, C.stem)}
    </>
  )
}

function Stage2() {
  return (
    <>
      <Pot />
      {/* short stem */}
      {px(7, 7, 2, 3, C.stem)}
      {/* tiny side leaves */}
      {px(5, 8, 2, 1, C.stem)}
      {px(9, 8, 2, 1, C.stem)}
    </>
  )
}

function Stage3() {
  return (
    <>
      <Pot />
      {Stem(5)}
      <Leaves />
    </>
  )
}

function Stage4() {
  return (
    <>
      <Pot />
      {Stem(5)}
      <Leaves />
      {/* floral bud */}
      {px(6, 3, 4, 2, C.budLight)}
      {/* bud border */}
      {px(6, 3, 4, 1, C.leafDark)}
      {px(6, 3, 1, 2, C.leafDark)}
      {px(9, 3, 1, 2, C.leafDark)}
      {px(6, 4, 4, 1, C.leafDark)}
    </>
  )
}

function Stage5() {
  return (
    <>
      <Pot />
      {Stem(5)}
      <Leaves />
      {/* petals — cross */}
      {px(6, 1, 4, 1, C.petalWhite)}
      {px(6, 5, 4, 1, C.petalWhite)}
      {px(4, 3, 2, 1, C.petalWhite)}
      {px(10, 3, 2, 1, C.petalWhite)}
      {/* petals — diagonals */}
      {px(5, 2, 1, 1, C.petalWhite)}
      {px(10, 2, 1, 1, C.petalWhite)}
      {px(5, 4, 1, 1, C.petalWhite)}
      {px(10, 4, 1, 1, C.petalWhite)}
      {/* pink petal tips */}
      {px(7, 1, 2, 1, C.petalPink)}
      {px(10, 3, 1, 1, C.petalPink)}
      {/* yellow center */}
      {px(6, 2, 4, 2, C.center)}
    </>
  )
}

const STAGES = [Stage1, Stage2, Stage3, Stage4, Stage5]

export function PlantDisplay({ stage, size = 'md' }: PlantDisplayProps) {
  const px_size = SIZE_PX[size]
  const clampedStage = Math.max(1, Math.min(stage, STAGES.length))
  const StageComponent = STAGES[clampedStage - 1]

  return (
    <svg
      width={px_size}
      height={px_size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges', display: 'block' }}
    >
      <StageComponent />
    </svg>
  )
}
