
function Point(x, y) {
    'use strict';
    
    this.x = x;
    this.y = y;

    this.between = function(pointA, pointB) {
        return (pointA.x <= this.x && this.x <= pointB.x) &&
            (pointA.y <= this.y && this.y <= pointB.y);
    };
}


function Square(pointA, pointB) {
    'use strict';

    this.point1 = pointA;
    this.point2 = pointB;
    
    this.moveSquare = function(pointA, pointB) {
        this.point1 = point1;
        this.point2 = point2;
    };

    this.inside = function(square) {
        var point3 = new Point(this.point1.x, this.point2.y);
        var point4 = new Point(this.point2.x, this.point1.y);

        return (this.point1.between(square.point1, square.point2) ||
            this.point2.between(square.point1, square.point2) ||
            point3.between(square.point1, square.point2) ||
            point4.between(square.point1, square.point2));

    };
}


function System() {
    'use strict';

    this.squares = [];
    this.deleting = false;
    this.firstPoint = undefined;

    var system = this;

    this.redrawSquare = function(square) {

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var pointA = square.point1;
        var pointB = square.point2;
        context.fillRect(pointA.x, pointA.y,(pointB.x - pointA.x), (pointB.y - pointA.y));
    };

    this.clearCanvas = function() {

        var context = document.getElementById('canvas').getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    this.getCurrentSquare = function(e) {

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        var mousePos = getMousePos(canvas, e);
        var point = new Point(mousePos.x, mousePos.y);
        var square = createSquare(this.firstPoint, point);
        return square;
    };

    this.refresh = function(e) {

        system.clearCanvas();
        var square;

        for (var i = 0; i < system.squares.length; i++) {
            square = system.squares[i];
            system.redrawSquare(square);
        }
        if (system.firstPoint !== undefined) {
            square = system.getCurrentSquare(e);
            system.redrawSquare(square);
        }
    };

    this.setupListeners = function () {

        document.getElementById('addremove').addEventListener('click', function() {

            system.deleting = system.deleting? false : true;
            this.innerHTML = system.deleting? "Add" : "Delete";
        });


        document.getElementById('clear').addEventListener('click', function() {

            system.clearCanvas();
            system.squares = [];
          });

        document.getElementById('changecolour').addEventListener('click', function(e) {

            var letters = '0123456789ABCDEF'.split('');
            var colour = '#';

            for (var i = 0; i < 6; i++ ) {
                colour += letters[Math.floor(Math.random() * 16)];
            }

            var c = document.getElementById("canvas");
            var ctx = c.getContext("2d");
            ctx.fillStyle = colour;
            system.refresh(e);
        });


        document.getElementById('canvas').addEventListener("mousedown" ,function(e) {

            if (e.which == 1) {
                var mousePos = getMousePos(this, e);
                var point = new Point(mousePos.x, mousePos.y);
                var square;

                if (system.deleting) {
                    for (var i = 0; i < system.squares.length; i++) {
                        square = system.squares[i];
                        if (point.between(square.point1, square.point2)) {
                            system.squares.splice(i, 1);
                        }
                    }
                    system.refresh(e);

                } else {
                    square = new Square(system.firstPoint, point);
                    system.firstPoint = point;
                }
            }
        });


        document.getElementById('canvas').addEventListener("mouseup", function(e) {

            if (e.which == 1 && system.firstPoint !== undefined) {
                
                var square = system.getCurrentSquare(e);
                system.redrawSquare(square);
                var prevSquare;
                for (var i = 0; i < system.squares.length; i++) {
                    prevSquare = system.squares[i];
                    if (prevSquare.inside(square) || square.inside(prevSquare)) {
                        alert("intersection");
                    }
                }
                system.squares.push(square);
            }
            system.firstPoint = undefined;
        });


        document.getElementById('canvas').addEventListener("mousemove", function(e) {

            if (system.firstPoint !== undefined) {
                system.refresh(e);
                var square = system.getCurrentSquare(e);
                system.redrawSquare(square);
            }
        });

    };

    function createSquare(pointA, pointB) {

        if (pointB.x >= pointA.x && pointB.y >= pointA.y) {
            return new Square(pointA, pointB);
        } else if (pointB.x >= pointA.x && pointA.y >= pointB.y) {
            return new Square(new Point(pointA.x, pointB.y), new Point(pointB.x, pointA.y));
        } else if (pointA.x >= pointB.x && pointB.y >= pointA.y) {
            return new Square(new Point(pointB.x, pointA.y), new Point(pointA.x, pointB.y));
        } else {
            return new Square(pointB, pointA); 
        }
    }


    function getMousePos(canvas, evt) {

        var rect = canvas.getBoundingClientRect();
        return {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
    }
}


document.addEventListener("DOMContentLoaded", function(event) {

    var system = new System();
    system.setupListeners();
    var ctx = document.getElementById("canvas").getContext("2d");
});
