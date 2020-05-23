export * from "./home/Home";
export * from "./create/Create";
export * from "./player/Player";
export * from "./manage/Manage";

export enum GameState {
  "init" = "init",
  "join" = "join",
  "create" = "create",
  "push" = "push",
  "lobby" = "lobby",
  "playing" = "playing",
  "end" = "end",
}
