const fs = require("fs");
const Joi = require("joi");

class Dice {
  constructor({T, B, U, D, L, R}) {
    this.T = T;
    this.B = B;
    this.U = U;
    this.D = D;
    this.L = L;
    this.R = R;
  }

  rotate_U() {
    const pre_T = this.T;
    const pre_B = this.B;
    const pre_U = this.U;
    const pre_D = this.D;

    this.T = pre_B;
    this.B = pre_D;
    this.D = pre_U;
    this.U = pre_T;
  }

  rotate_B() {
    const pre_T = this.T;
    const pre_B = this.B;
    const pre_U = this.U;
    const pre_D = this.D;

    this.T = pre_U;
    this.U = pre_D;
    this.D = pre_B;
    this.B = pre_T;
  }

  rotate_L() {
    const pre_T = this.T;
    const pre_L = this.L;
    const pre_R = this.R;
    const pre_D = this.D;

    this.T = pre_R;
    this.R = pre_D;
    this.D = pre_L;
    this.L = pre_T;
  }

  rotate_R() {
    const pre_T = this.T;
    const pre_L = this.L;
    const pre_R = this.R;
    const pre_D = this.D;

    this.T = pre_L;
    this.L = pre_D;
    this.D = pre_R;
    this.R = pre_T;
  }

  findCurrentFace(face) {
    switch (face) {
      case this.T:
        return "T"
      case this.B:
        return "B"
      case this.U:
        return "U"
      case this.D:
        return "D"
      case this.L:
        return "L"
      case this.R:
        return "R"
              
    }
  }

  toString() {
    console.log("------");
    console.log("|T", this.T, "|");
    console.log("|B", this.B, "|");
    console.log("|U", this.U, "|");
    console.log("|D", this.D, "|");
    console.log("|L", this.L, "|");
    console.log("|R", this.R, "|");
    console.log("-----");
  }
}

const readFileInput = async (fileName) => {
  try {
    const data = await fs.readFileSync(fileName, "utf-8");
    const lines = data.split("\n");

    const T = +lines[0].split(" ")[0];
    const B = +lines[0].split(" ")[1];
    const U = +lines[0].split(" ")[2];
    const D = +lines[0].split(" ")[3];
    const L = +lines[0].split(" ")[4];
    const R = +lines[0].split(" ")[5];

    const number_of_step = +lines[1];
    const faces = [];
    for (let i = 2; i < lines.length; i++) {
      faces.push(+lines[i])
    }

    return { T, B, U, D, L, R, number_of_step, faces };
  } catch (error) {
    console.log(`[ERROR]: read file ${fileName} fail`, error);
  }
}

const validate = async (data) => {
  const Schema = Joi.object({
    T: Joi.number().required().min(1).max(6),
    B: Joi.number().required().min(1).max(6),
    U: Joi.number().required().min(1).max(6),
    D: Joi.number().required().min(1).max(6),
    L: Joi.number().required().min(1).max(6),
    R: Joi.number().required().min(1).max(6),
    number_of_step: Joi.number().min(2).max(1000),
    faces: Joi.array().items(Joi.number().required().min(1).max(6)).length(Joi.ref('number_of_step'))
  }).required()
  try {
    await Schema.validateAsync(data);

    // check dice valid from 1 -> 6
    if (new Set([data.T, data.B, data.U, data.D, data.L, data.R]).size !== 6) {
      throw "{not valid dice}"
    }
  } catch (error) {
    console.log(`[ERROR]: validate fail`, error);
  }
}

const main = async () => {
  const data = await readFileInput(`${__dirname}/input.txt`);
  validate(data);

  const dice = new Dice(data);
  console.log("INIT")
  dice.toString()

  let total_rotate = 0;
  data.faces.forEach((face_number, index) => {
    console.log("STEP", index)
    const currentFace = dice.findCurrentFace(face_number);
    switch (currentFace) {
      case "T":
        break;
      case "B":
        dice.rotate_U()
        total_rotate++;
        break;
      case "U":
        dice.rotate_B()
        total_rotate++;
        break;
      case "D":
        dice.rotate_U();
        dice.rotate_U();
        total_rotate += 2;
        break;
      case "L":
        dice.rotate_R();
        total_rotate++;
        break;
      case "R":
        dice.rotate_L();
        total_rotate++;
        break;
    }
    dice.toString();
    console.log("CURRENT ROTATE", total_rotate)
  })

  console.log("TOTAL ROTATE", total_rotate)
}

main();