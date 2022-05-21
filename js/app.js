import {nivel1} from "./nivel1.js"
import {nivel2} from "./nivel2.js"
import {nivel3} from "./nivel3.js"
//import { Phaser } from '../phaser.min';

let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1920,
    height: 603,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        }
    },
    scene: [nivel1, nivel2, nivel3]
});

