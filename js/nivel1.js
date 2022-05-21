export class nivel1 extends Phaser.Scene
{
    constructor()
    {
        super( {key:'nivel1'} );
    }

    player;
    player2;
    pantallaMovil;
    stars;
    bombs;
    platforms;
    cursors;
    score = 0;
    score2 = 0;
    gameOver = false;
    scoreText;
    nivel;
    posicion = 100;
    spawnbombs = 8;
    spawnStars = 43;
    posX = 12; 
    posX2 = 35;
    final;
    overlaping1 = false;
    overlaping2 = false;

    preload ()
    {
        this.load.image('ground', 'assetes/platform.png');
        this.load.image('star', 'assetes/star.png');
        this.load.image('bomb', 'assetes/bomb.png');
        this.load.spritesheet('dude', 'assetes/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('dude2', 'assetes/dude2.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('back1', 'assetes/back1.png');
        this.load.image('back2', 'assetes/back2.png');
        this.load.image('back3', 'assetes/back3.png');
        this.load.image('lamp', 'assetes/lamp.png');
    }

    create ()
    {
        this.physics.world.checkCollision.down = true;
        this.pantallaMovil = this.add.zone(603, 3000, 3000, 603);
        this.physics.world.enable(this.pantallaMovil, Phaser.Physics.Arcade.STATIC_BODY);
        
        //Fondo
        this.add.image(540, 304, 'back1') * 3;
        this.add.image(540, 304, 'back2');
        this.add.image(540, 304, 'back3');
        this.add.image(1620, 304, 'back1');
        this.add.image(1620, 304, 'back2');
        this.add.image(1620, 304, 'back3');
        this.add.image(2700, 304, 'back1');
        this.add.image(2700, 304, 'back2');
        this.add.image(2700, 304, 'back3');

        this.platforms = this.physics.add.staticGroup();

        //Piso
        while ( this.posicion < 3000 ) {
            this.platforms.create(this.posicion, 590, 'ground').setScale(1).refreshBody();
            this.posicion += 240;
        }

        //Piso flotante
        this.platforms.create(600, 450, 'ground');
        this.platforms.create(100, 350, 'ground');
        this.platforms.create(750, 320, 'ground');
        this.platforms.create(380, 250, 'ground');
        this.platforms.create(970, 190, 'ground');
        this.platforms.create(1210, 190, 'ground');
        this.platforms.create(1050, 400, 'ground');
        this.platforms.create(1350, 500, 'ground');
        this.platforms.create(1550, 300, 'ground');
        this.platforms.create(1850, 150, 'ground');
        this.platforms.create(1950, 150, 'ground');
        this.platforms.create(2050, 500, 'ground');
        this.platforms.create(2300, 350, 'ground');
        this.platforms.create(2700, 450, 'ground');
        this.platforms.create(2800, 250, 'ground');

        //Jugadores
        this.player = this.physics.add.sprite(150, 450, 'dude');
        this.player2 = this.physics.add.sprite(100, 450, 'dude2');

        //Físicas del jugador
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player2.setBounce(0.2);
        this.player2.setCollideWorldBounds(true);

        //Caminar izquierda, derecha - Jugador 1
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });


        //Caminar izquierda, derecha - Jugador 2
        this.anims.create({
            key: 'left2',
            frames: this.anims.generateFrameNumbers('dude2', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn2',
            frames: [ { key: 'dude2', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right2',
            frames: this.anims.generateFrameNumbers('dude2', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cameras.main.setBounds(0, 0, 3000, 603, true, true, true, false);
        this.physics.world.setBounds(0, 0, 3000, 603, true, true, true, false);
        this.cameras.main.startFollow(this.player);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        //  Some stars to collect, 16 in total, evenly spaced 70 pixels apart along the x axis
        this.stars = this.physics.add.group();
        this.stars.children.iterate(function (child) {

            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.bombs = this.physics.add.group();

        this.final = this.physics.add.group({
            key: 'lamp',
            setXY: { x: 2850, y: 100}
        });

        //  The score
        this.scoreText = this.add.text(1300, 16, 'Score P1: 0', { fontSize: '32px', fill: '#fff' });
        this.scoreText2 = this.add.text(1600, 16, 'Score P2: 0', { fontSize: '32px', fill: '#fff' });
        this.nivel = this.add.text(1100, 16, 'Nivel 1', { fontSize: '32px', fill: '#fff' });

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.final, this.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.stars, this.collectStar2, null, this);
        this.physics.add.overlap(this.player2, this.stars, this.collectStar, null, this);
        
        this.physics.add.overlap(this.player, this.final, this.finalizarNivel, null, this);
        this.physics.add.overlap(this.player2, this.final, this.finalizarNivel, null, this);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
        this.physics.add.collider(this.player2, this.bombs, this.hitBomb, null, this);
    }

    update ()
    {
        if (this.gameOver)
        {
            return;
        }

        if (this.overlaping1 === true && this.overlaping2 === true)
        {
            this.scene.start("nivel2");
        }

        if (this.spawnbombs > 0)
        {
            var y = Phaser.Math.Between(0, 350);
            var bomb = this.bombs.create(this.posX2, y, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 50);
                bomb.allowGravity = false;
                this.posX2+=200
            this.spawnbombs--;
        }

        if (this.spawnStars > 0)
        {
            var y = Phaser.Math.Between(0, 300);
            var starsss = this.stars.create(this.posX, y, 'star');
            starsss.allowGravity = true;
            this.posX += 70;
            this.spawnStars--;
        }

        //PLAYER2 KEYS
        if (this.keyA.isDown) 
        {
            this.player2.setVelocityX(-160);
            this.player2.anims.play('left2', true);

        }
        else if (this.keyD.isDown)
        {
            this.player2.setVelocityX(160);
            this.player2.anims.play('right2', true);
        }
        else
        {
            this.player2.setVelocityX(0);
            this.player2.anims.play('turn2');
        }
        if (this.keyW.isDown && this.player2.body.touching.down)
        {
            this.player2.setVelocityY(-330);
        }

        //PLAYER1 KEYS
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }

    collectStar (player, star, bandera)
    {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score P1: ' + this.score);
    }

    collectStar2 (player, star)
    {
        star.disableBody(true, true);
        this.score2 += 10;
        this.scoreText2.setText('Score P2: ' + this.score2);
    }

    hitBomb (player, bomb)
    {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
    }

    finalizarNivel (a, final)
    {
        if(a === this.player){
            this.overlaping1 = true;
            this.player.disableBody(true, false);
        }
        else if(a === this.player2){
            this.overlaping2 = true;
            this.player2.disableBody(true, false);
        }
    }
}