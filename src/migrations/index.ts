import * as migration_20260616_014745_initial from "./20260616_014745_initial.ts";

export const migrations = [
  {
    up: migration_20260616_014745_initial.up,
    down: migration_20260616_014745_initial.down,
    name: '20260616_014745_initial'
  },
];
