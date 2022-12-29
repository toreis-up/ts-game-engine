import { CharacterTile } from "./charactertile";

export class Party {
  member: CharacterTile[];
  speed: number;

  constructor(...args: CharacterTile[]) {
    this.member = args;
    this.speed = 1;
  }

  setMemberDirection() {
    this.member.forEach((member, index) => {
      if (index === 0) return;
      if (this.member[index - 1].mapX < member.mapX) member.direction = 1;
      if (this.member[index - 1].mapX > member.mapX) member.direction = 2;
      if (this.member[index - 1].mapY < member.mapY) member.direction = 3;
      if (this.member[index - 1].mapY > member.mapY) member.direction = 0;
    });
  }

  setMemberVerocity(direction: string) {
    this.member.forEach((member, index) => {
      if (index === 0) return; // continue
      let _samePrevX;
      let _samePrevY;
      let _lessThanPrevX;
      let _lessThanPrevY;
      let _moreThanPrevX;
      let _moreThanPrevY;
      let _moreThanOneTile;

      if (direction === "up") {
        _samePrevX = 0;
        _samePrevY = 1;
        _lessThanPrevX = -1;
        _lessThanPrevY = 0;
        _moreThanPrevX = 1;
        _moreThanPrevY = 2;
        _moreThanOneTile = -1;
      } else if (direction === "down") {
        _samePrevX = 0;
        _samePrevY = -1;
        _lessThanPrevX = -1;
        _lessThanPrevY = -2;
        _moreThanPrevX = 1;
        _moreThanPrevY = 0;
        _moreThanOneTile = 1;
      } else if (direction === "left") {
        _samePrevX = 1;
        _samePrevY = 0;
        _lessThanPrevX = 0;
        _lessThanPrevY = -1;
        _moreThanPrevX = 2;
        _moreThanPrevY = 1;
        _moreThanOneTile = -1;
      } else if (direction === "right") {
        _samePrevX = -1;
        _samePrevY = 0;
        _lessThanPrevX = -2;
        _lessThanPrevY = -1;
        _moreThanPrevX = 0;
        _moreThanPrevY = 1;
        _moreThanOneTile = 1;
      }

      if (this.member[index - 1].mapX === member.mapX)
        member.vx = this.speed * _samePrevX;
      if (this.member[index - 1].mapY === member.mapY)
        member.vy = this.speed * _samePrevY;

      if (this.member[index - 1].mapX < member.mapX) {
        member.vx = this.speed * _lessThanPrevX;
        if (
          direction === "left" &&
          member.mapX - this.member[index - 1].mapX > 1
        )
          member.vx = this.speed * _moreThanOneTile;
      }
      if (this.member[index - 1].mapX > member.mapX) {
        member.vx = this.speed * _moreThanPrevX;
        if (
          direction === "right" &&
          this.member[index - 1].mapX - member.mapX > 1
        )
          member.vx = this.speed * _moreThanOneTile;
      }
      if (this.member[index - 1].mapY < member.mapY) {
        member.vy = this.speed * _lessThanPrevY;
        if (direction === "up" && member.mapY - this.member[index - 1].mapY > 1)
          member.vy = this.speed * _moreThanOneTile;
      }
      if (this.member[index - 1].mapY > member.mapY) {
        member.vy = this.speed * _moreThanPrevY;
        if (
          direction === "down" &&
          this.member[index - 1].mapY - member.mapY > 1
        )
          member.vy = this.speed * _moreThanOneTile;
      }
    });
  }
}
