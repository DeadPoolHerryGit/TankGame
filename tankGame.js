//定义color数组
var aHeroColor = ["#ded284","#cba719"];
var aEnemyColor = ["#00a2b5","#00fefe"];
//炸弹类
function fnBomb (x,y) {
  this.x = x;
  this.y = y;
  this.isLive = true;
  this.blood = 6;
  this.bloodDown = function () {
    if (this.blood != 0) {
      this.blood--;
    } else{
      this.isLive = false;
    };
  }
}
//子弹类
function fnBullet (x,y,direct,speed,tank) {
  this.x = x;
  this.y = y;
  this.direct = direct;
  this.speed = speed;
  this.tank = tank;
  this.timer = null;
  this.isLive = true;
  this.run = function () {
    if (this.x < 0 || this.x > 400 || this.y <0 || this.y >300 || this.isLive == false) {
      window.clearInterval(this.timer);
      this.isLive = false;
      this.tank.bulletIsLive = false;
    } else{
      switch (this.direct) {
        case 0:
          this.y -= this.speed;
          break;
        case 1:
          this.x += this.speed;
          break;
        case 2:
          this.y += this.speed;
          break;
        case 3:
          this.x -= this.speed;
          break;
      }
      document.getElementById("jurn").innerText = "子弹x=" + this.x + "子弹y=" + this.y;
    }
  }//run
}
//坦克类
function fnTank (x,y,direct,color,speed) {
  this.x = x;
  this.y = y;
  this.direct = direct;
  this.color = color;
  this.isLive = true;
  this.isRun = true;
  this.bulletIsLive = true;
  this.speed = speed;
  this.moveUp = function () {
    if (this.y > 0 && this.isRun) {
      this.y -= this.speed;
    }
  }//向上移动
  this.moveRight = function () {
    if (this.x < 370 && this.isRun) {
      this.x += this.speed;
    }
  }//向右移动
  this.moveDown = function () {
    if (this.y < 270 && this.isRun) {
      this.y += this.speed;
    }
  }//向下移动
  this.moveLeft = function () {
    if (this.x > 0 && this.isRun) {
      this.x -= this.speed;
    }
  }//向左移动
}
//英雄坦克类
function fnHeroTank (x,y,direct,color,speed) {
  this.tank = fnTank;
  this.tank (x,y,direct,color,speed);
  //射击
  this.shot = function () {
    if (this.bulletIsLive == false || aHeroBullet.length == 0) {
      switch (this.direct) {
        case 0:
          var oBullet = new fnBullet(this.x+14,this.y-3,this.direct,2.5,this);
          break;
        case 1:
          var oBullet = new fnBullet(this.x+27,this.y+14,this.direct,2.5,this);
          break;
        case 2:
          var oBullet = new fnBullet(this.x+14,this.y+27,this.direct,2.5,this);
          break;
        case 3:
          var oBullet = new fnBullet(this.x-3,this.y+14,this.direct,2.5,this);
          break;
      }
      aHeroBullet.push(oBullet);
      //让子弹飞
      var oTimer = window.setInterval("aHeroBullet["+(aHeroBullet.length - 1)+"].run()",20);
      //把oTimer赋值给子弹
      aHeroBullet[aHeroBullet.length - 1].timer = oTimer;
      this.bulletIsLive = true;
    }
  }
}
//敌人坦克类
function fnEnemyTank (x,y,direct,color,speed) {
  this.tank = fnTank;
  this.tank(x,y,direct,color,speed);
  this.count = 0;
  this.run = function () {
    switch (this.direct) {
      case 0:
        this.moveUp();
        break;
      case 1:
        this.moveRight();
        break;
      case 2:
        this.moveDown();
        break;
      case 3:
        this.moveLeft();
        break;
    }
    //走30次换一次方向
    if (this.count > 30) {
      this.direct = Math.round(Math.random() * 3);//随机得到0、1、2、3
      this.count = 0;
    }
    this.count++;
    if (this.isLive) {
      //判断子弹死亡，增加一颗子弹
      if (this.bulletIsLive == false) {
        switch (this.direct) {
          case 0:
            var oBullet = new fnBullet(this.x + 14,this.y,this.direct,2,this);
            break;
          case 1:
            var oBullet = new fnBullet(this.x + 27,this.y + 14,this.direct,2,this);
            break;
          case 2:
            var oBullet = new fnBullet(this.x + 14,this.y + 27,this.direct,2,this);
            break;
          case 3:
            var oBullet = new fnBullet(this.x,this.y + 14,this.direct,2,this);
            break;
        }
        aEnemyBullet.push(oBullet);
        var oBtimer = window.setInterval("aEnemyBullet["+ (aEnemyBullet.length - 1) +"].run()",50);
        aEnemyBullet[aEnemyBullet.length - 1].timer = oBtimer;
        this.bulletIsLive = true;
      }
    }
  }
}
//判断是否击中敌人
function fnIsHit (aBullet,aTank,aBomb) {
  //取出一颗子弹
  for (var i=0;i<aBullet.length;i++) {
    var oBullet = aBullet[i];
    if (oBullet.isLive) {
      //遍历所有坦克
      for (var j=0;j<aTank.length;j++) {
        var oTank = aTank[j];
        if (oTank.isLive) {
          //根据方向判断
          switch (oTank.direct) {
            case 0:
            case 2:
              if (oBullet.x <= oTank.x + 30 && oBullet.x >= oTank.x
                && oBullet.y <= oTank.y + 26 && oBullet.y >= oTank.y) {
                oTank.isLive = false;
                oBullet.isLive = false;
                var oBomb = new fnBomb(oTank.x,oTank.y);
                aBomb.push(oBomb);
              }
              break;
            case 1:
            case 3:
              if (oBullet.x <= oTank.x + 26 && oBullet.x >= oTank.x
                && oBullet.y <= oTank.y + 30 && oBullet.y >= oTank.y) {
                oTank.isLive = false;
                oBullet.isLive = false;
                var oBomb = new fnBomb(oTank.x,oTank.y);
                aBomb.push(oBomb);
              }
              break;
          }
        }
      }
    }//oBullet if
  }
}
//画出炸弹
function fnDrawBomb (aBomb) {
  //取出炸弹
  for (var i=0;i<aBomb.length;i++) {
    var oBomb = aBomb[i];
    if (oBomb.isLive) {
      //根据不同血量画出不同效果
      if (oBomb.blood > 4) {
        var oImg1 = new Image;
        oImg1.src = "bomb_1.gif";
        oImg1.onload = function () {
          oCxt.drawImage(oImg1,oBomb.x,oBomb.y,30,26);
        }
      } else if (oBomb.blood >2) {
        var oImg2 = new Image;
        oImg2.src = "bomb_2.gif";
        oImg2.onload = function () {
          oCxt.drawImage(oImg2,oBomb.x,oBomb.y,30,26);
        } 
      }else {
        var oImg3 = new Image;
        oImg3.src = "bomb_3.gif";
        oImg3.onload = function () {
          oCxt.drawImage(oImg3,oBomb.x,oBomb.y,30,26);
        }
      }
      oBomb.bloodDown();//减血
      if (oBomb.blood < 0) {
        aBomb.splice(i,1);//从数组中去除
      }
    }//oBomb.isLive
  }
}
//画出子弹
function fnDrawBullet (aBullet) {
  for (var i=0;i<aBullet.length;i++) {
    var oBullet = aBullet[i];
    if (oBullet.isLive) {
      oCxt.fillStyle = "#fef26e";
      oCxt.fillRect(oBullet.x,oBullet.y,2,2);
    };
  }
}
//画出坦克
function fnDrawTank(tank) {
  if (tank.isLive) {
    switch (tank.direct) {
      case 0:
      case 2:
        oCxt.beginPath();
        //左边轮子
        oCxt.fillStyle = tank.color[0];
        oCxt.fillRect(tank.x,tank.y,5,26);
        //中间方块
        oCxt.fillStyle = tank.color[0];
        oCxt.fillRect(tank.x+6,tank.y+5,18,16);
        //圆形炮台
        oCxt.fillStyle = tank.color[1];
        oCxt.arc(tank.x+15,tank.y+13,5,0,360);
        oCxt.fill();
        //炮筒
        oCxt.lineWidth = 2;
        oCxt.strokeStyle = tank.color[1];
        oCxt.moveTo(tank.x+15,tank.y+13);
        if (tank.direct == 0) {
          oCxt.lineTo(tank.x+15,tank.y-2);
        } else if (tank.direct == 2) {
          oCxt.lineTo(tank.x+15,tank.y+28);
        }
        oCxt.stroke();
        //右边轮子
        oCxt.fillStyle = tank.color[0];
        oCxt.fillRect(tank.x+25,tank.y,5,26);
        oCxt.closePath();
        break;
      case 1:
      case 3:
        oCxt.beginPath();
        //左边轮子
        oCxt.fillStyle = tank.color[0];
        oCxt.fillRect(tank.x,tank.y,26,5);
        //中间方块
        oCxt.fillStyle = tank.color[0];
        oCxt.fillRect(tank.x+5,tank.y+6,16,18);
        //圆形炮台
        oCxt.fillStyle = tank.color[1];
        oCxt.arc(tank.x+13,tank.y+15,5,0,360);
        oCxt.fill();
        //炮筒
        oCxt.lineWidth = 2;
        oCxt.strokeStyle = tank.color[1];
        oCxt.moveTo(tank.x+13,tank.y+15);
        if (tank.direct == 1) {
          oCxt.lineTo(tank.x+28,tank.y+15);
        } else if (tank.direct == 3) {
          oCxt.lineTo(tank.x-2,tank.y+15);
        }
        oCxt.stroke();
        //右边轮子
        oCxt.fillStyle = tank.color[0];
        oCxt.fillRect(tank.x,tank.y+25,26,5);
        oCxt.closePath();
        break;
    }
  }
}
