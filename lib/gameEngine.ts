// Game constants and types
export const GRID_SIZE = 20;
export const CELL_SIZE = 20;

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  trees: Position[];
  fence: Position[];
  score: number;
  gameOver: boolean;
  gamePaused: boolean;
  gameStarted: boolean;
  sunsetMode: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
  nextDirection: 'up' | 'down' | 'left' | 'right';
  powerups: Powerup[];
  particles: Particle[];
}

export interface Powerup {
  id: string;
  position: Position;
  type: 'shrink' | 'slowdown' | 'bonus';
  expireAt: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  type: 'leaf' | 'pollen' | 'crunch';
}

export const INITIAL_STATE: GameState = {
  snake: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ],
  food: { x: 15, y: 15 },
  trees: [],
  fence: [],
  gameStarted: false,
  score: 0,
  gameOver: false,
  gamePaused: false,
  sunsetMode: false,
  direction: 'right',
  nextDirection: 'right',
  powerups: [],
  particles: [],
};

// Game logic functions
export function getRandomPosition(): Position {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function isPositionOccupied(
  pos: Position,
  snake: Position[],
  trees: Position[]
): boolean {
  return (
    snake.some(segment => positionsEqual(segment, pos)) ||
    trees.some(tree => positionsEqual(tree, pos))
  );
}

export function getRandomPowerup(pos: Position): Powerup {
  const types: Array<Powerup['type']> = ['shrink', 'slowdown', 'bonus'];
  return {
    id: Math.random().toString(36),
    position: pos,
    type: types[Math.floor(Math.random() * types.length)],
    expireAt: Date.now() + 10000, // 10 second expiration
  };
}

export function updateGameState(state: GameState): GameState {
  if (state.gameOver || state.gamePaused || !state.gameStarted) return state;

  // Deep copy to avoid mutations
  const newState: GameState = {
    ...state,
    snake: [...state.snake],
    trees: [...state.trees],
    powerups: [...state.powerups],
    particles: [...state.particles],
  };
  newState.direction = state.nextDirection;

  // Calculate new head position
  const head = newState.snake[0];
  const newHead: Position = { ...head };

  switch (newState.direction) {
    case 'up':
      newHead.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
      break;
    case 'down':
      newHead.y = (head.y + 1) % GRID_SIZE;
      break;
    case 'left':
      newHead.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
      break;
    case 'right':
      newHead.x = (head.x + 1) % GRID_SIZE;
      break;
  }

  // Check wall collision (trees)
  if (newState.trees.some(tree => positionsEqual(newHead, tree))) {
    newState.gameOver = true;
    createCrashParticles(newState, newHead);
    return newState;
  }

  // Check self collision
  if (newState.snake.some(segment => positionsEqual(newHead, segment))) {
    newState.gameOver = true;
    return newState;
  }

  newState.snake.unshift(newHead);

  // Check food collision
  let foodEaten = false;
  if (positionsEqual(newHead, newState.food)) {
    foodEaten = true;
    newState.score += 100;
    createEatParticles(newState, newHead);

    // Spawn trees every odd food eaten (progressive difficulty)
    if (newState.score % 200 === 100) {
      // Odd food: every 2nd food eaten
      let treePos = getRandomPosition();
      while (isPositionOccupied(treePos, newState.snake, newState.trees)) {
        treePos = getRandomPosition();
      }
      // 10% chance for bonus apple
      if (Math.random() < 0.1) {
        const bonusPos = getRandomPosition();
        newState.powerups.push(getRandomPowerup(bonusPos));
      }
      newState.trees.push(treePos);
    }

    // Spawn new food
    let newFood = getRandomPosition();
    while (isPositionOccupied(newFood, newState.snake, newState.trees)) {
      newFood = getRandomPosition();
    }
    newState.food = newFood;

    // Unlock sunset mode at 1000pts
    if (newState.score >= 1000 && !newState.sunsetMode) {
      newState.sunsetMode = true;
    }
  } else {
    newState.snake.pop();
  }

  // Check powerup collision
  newState.powerups = newState.powerups.filter(powerup => {
    if (Date.now() > powerup.expireAt) return false;
    if (positionsEqual(newHead, powerup.position)) {
      handlePowerup(newState, powerup);
      return false;
    }
    return true;
  });

  // Fence logic: 5% segments "rust" every 500 points
  if (newState.score > 0 && newState.score % 500 === 0 && newState.fence.length === 0) {
    generateFenceSegments(newState);
  }

  // Update particles
  updateParticles(newState);

  return newState;
}

function handlePowerup(state: GameState, powerup: Powerup): void {
  switch (powerup.type) {
    case 'shrink':
      // Remove one segment
      if (state.snake.length > 3) {
        state.snake.pop();
      }
      state.score += 50;
      break;
    case 'slowdown':
      // Grants temporary invincibility (visual only in this demo)
      state.score += 25;
      break;
    case 'bonus':
      // Extra points
      state.score += 200;
      break;
  }
}

function generateFenceSegments(state: GameState): void {
  // Create fence around edges with 5% passable segments
  const fencePositions: Position[] = [];

  // Top and bottom edges
  for (let x = 0; x < GRID_SIZE; x++) {
    if (Math.random() > 0.05) {
      fencePositions.push({ x, y: 0 });
      fencePositions.push({ x, y: GRID_SIZE - 1 });
    }
  }

  // Left and right edges
  for (let y = 1; y < GRID_SIZE - 1; y++) {
    if (Math.random() > 0.05) {
      fencePositions.push({ x: 0, y });
      fencePositions.push({ x: GRID_SIZE - 1, y });
    }
  }

  state.fence = fencePositions;
}

function createEatParticles(state: GameState, position: Position): void {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    state.particles.push({
      id: Math.random().toString(36),
      x: position.x * CELL_SIZE + CELL_SIZE / 2,
      y: position.y * CELL_SIZE + CELL_SIZE / 2,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 2,
      life: 30,
      type: 'crunch',
    });
  }
}

function createCrashParticles(state: GameState, position: Position): void {
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * 2 * i) / 16;
    state.particles.push({
      id: Math.random().toString(36),
      x: position.x * CELL_SIZE + CELL_SIZE / 2,
      y: position.y * CELL_SIZE + CELL_SIZE / 2,
      vx: Math.cos(angle) * 3,
      vy: Math.sin(angle) * 3,
      life: 40,
      type: 'leaf',
    });
  }
}

function updateParticles(state: GameState): void {
  state.particles = state.particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.1, // Gravity
      life: p.life - 1,
    }))
    .filter(p => p.life > 0);
}
