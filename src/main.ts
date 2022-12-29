import { CharacterTile } from "./engine/charactertile";
import { Game } from "./engine/game";
import { Scene } from "./engine/scene";
import { Tile } from "./engine/tile";
import { Tilemap } from "./engine/tilemap";
import { Text } from "./engine/text";
import { DPad } from "./engine/dpad";
import { Party } from "./engine/party";
import { MapEngine } from "./map";

const WALKING_SPEED = 4;
const TILE_SIZE = 32;

addEventListener("load", () => {
  const game = new Game();

  game.preload('./static/img/yamada.png', './static/img/rico.png', './static/img/aru.png', './static/img/start.png', './static/img/goal.png', './static/img/tile.png', './static/img/dpad.png', './static/sound/bgm.mp3', './static/sound/start.mp3', './static/sound/clear.mp3')

  game.keybind("space", " ");

  game.main(() => {

  const mainScene = () => {

    const scene = new Scene();

    const mapEngine = new MapEngine();

    const map = mapEngine.loadMap();

    const tilemap = new Tilemap("./static/img/tile.png");
    tilemap.setMap(map);
    tilemap.x = TILE_SIZE * 4 - TILE_SIZE / 2;
    tilemap.y = TILE_SIZE * 3 - TILE_SIZE / 2;
    tilemap.setObstacles([0, 3, 6, 7, 8, 9, 10, 11]);
    scene.addObject(tilemap);

    const start = new Tile("./static/img/start.png");

    start.x = TILE_SIZE;
    start.y = TILE_SIZE * 2;

    tilemap.addTile(start);

    const goal = new Tile("./static/img/goal.png");

    goal.x = TILE_SIZE * 98;
    goal.y = TILE_SIZE * 98;

    tilemap.addTile(goal);

    const yamada = new CharacterTile("./static/img/yamada.png", false);
    yamada.x = yamada.y = TILE_SIZE * 5 - TILE_SIZE / 2;

    tilemap.addTile(yamada);

    const rico = new CharacterTile("./static/img/rico.png");
    rico.x = TILE_SIZE * 7 - TILE_SIZE / 2;
    rico.y = TILE_SIZE * 5 - TILE_SIZE / 2;
    rico.isSynchronize = false;
    tilemap.addTile(rico);

    const aru = new CharacterTile("./static/img/aru.png");
    aru.x = TILE_SIZE * 7 - TILE_SIZE / 2;
    aru.y = TILE_SIZE * 6 - TILE_SIZE / 2;
    aru.isSynchronize = false;
    tilemap.addTile(aru);

    const party = new Party(yamada, rico, aru);
    party.speed = WALKING_SPEED;

    const dpad = new DPad("./static/img/dpad.png", 80);
    dpad.x = 10;
    dpad.y = 230;

    scene.addObject(dpad);

    scene.onChangeScene = () => {
      game.sounds['./static/sound/start.mp3'].stop();
      game.sounds['./static/sound/bgm.mp3'].soundLoop();
    }

    let toggleForAnimation = 0;
    let hasDisplayedGoalText = false;
    let isMovable = true;

    scene.onEnterFrame = () => {
      if (
        (tilemap.x - TILE_SIZE / 2) % TILE_SIZE === 0 &&
        (tilemap.y - TILE_SIZE / 2) % TILE_SIZE === 0
      ) {
        tilemap.vx = tilemap.vy = 0;
        party.member.forEach((member) => {
          member.vx = member.vy = 0;
          member.animation = 1;
        });

        if (yamada.isOverlapped(goal)) {
          if (!hasDisplayedGoalText) {
            const goalText = new Text("ゴール！");

            goalText.size = 50;
            goalText.x = 15;
            goalText.y = 135;
            goalText.middle().center();
            scene.addObject(goalText);
            hasDisplayedGoalText = true;
            isMovable = false;
            game.sounds['./static/sound/bgm.mp3'].stop();
            game.sounds['./static/sound/clear.mp3'].start()
            setTimeout(() => {
              game.currentScene = titleScene();
            }, 6000);
          }
        }

        if (isMovable) {
          if (game.input.left || dpad.arrow.left) {
            party.setMemberVerocity("left");
            tilemap.vx = WALKING_SPEED;
            yamada.direction = 1;
          } else if (game.input.right || dpad.arrow.right) {
            party.setMemberVerocity("right");
            tilemap.vx = -1 * WALKING_SPEED;
            yamada.direction = 2;
          } else if (game.input.up || dpad.arrow.up) {
            party.setMemberVerocity("up");
            tilemap.vy = WALKING_SPEED;
            yamada.direction = 3;
          } else if (game.input.down || dpad.arrow.down) {
            party.setMemberVerocity("down");
            tilemap.vy = -1 * WALKING_SPEED;
            yamada.direction = 0;
          }

          const yamadaCoodinateAfterMoveX =
            yamada.mapX - tilemap.vx / WALKING_SPEED;
          const yamadaCoodinateAfterMoveY =
            yamada.mapY - tilemap.vy / WALKING_SPEED;

          if (
            tilemap.hasObstacle(
              yamadaCoodinateAfterMoveX,
              yamadaCoodinateAfterMoveY
            )
          ) {
            tilemap.vx = tilemap.vy = 0;

            party.member.forEach((member) => {
              member.vx = member.vy = 0;
            });
          }
          if (tilemap.vx !== 0 || tilemap.vy !== 0) party.setMemberDirection();
        }
      } else if (
        (tilemap.x + TILE_SIZE / 2) % (TILE_SIZE / 2) === 0 &&
        (tilemap.y + TILE_SIZE / 2) % (TILE_SIZE / 2) === 0
      ) {
        toggleForAnimation ^= 1;
        party.member.forEach((member) => {
          if (toggleForAnimation === 0) member.animation = 2;
          else member.animation = 0;
        });
      }
    };
  
    return scene;
  };

  const titleScene = () => {
    const scene = new Scene();

    const titleText = new Text("とれいすらびりんす");
    titleText.center().middle();
    scene.addObject(titleText);

    scene.onChangeScene = () => {
      game.sounds['./static/sound/clear.mp3'].stop();
      game.sounds['./static/sound/start.mp3'].start();
    }

    scene.ontouchstart = () => {
      game.currentScene = mainScene();
    };

    scene.onEnterFrame = () => {
      if (game.input.space) game.currentScene = mainScene();
    };
    return scene;
  };

  game.addScene(titleScene());
  game.addScene(mainScene());

  game.start();
  })
});
