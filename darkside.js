// Dark Side of the Moon
// Draw a triangle with current fill and stroke at a given width
// and height.
function triangle(ctx, width, height) 
{
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-width/2, height);
    ctx.lineTo(width/2, height);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-width/2, height);
    ctx.lineTo(width/2, height);
    ctx.closePath();
    ctx.stroke();
}

function beam(ctx, width, height)
{
    point_x = width/2 - width/13;
    point_y = height/3 + height/40; 

    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = Math.max(1, Math.max(width, height)/300);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(point_x, point_y);
    ctx.stroke();
    ctx.restore();

    // Inner beam
    var lingrad = ctx.createLinearGradient(0, 0, width/10, 0);
    lingrad.addColorStop(1, 'black');
    lingrad.addColorStop(0, 'WhiteSmoke');

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = lingrad;
    ctx.translate(point_x, point_y);
    ctx.rotate(-0.14);
    ctx.moveTo(0, 0);
    ctx.lineTo(x/3.14, 0);
    ctx.lineTo(x/2.5, x/5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function colour_beam(ctx, width, height, p_width)
{
    ctx.save();
    ctx.translate(width/2, height/3-p_width/10);
    ctx.lineWidth = width/150;

    function disp_beam()
    {
        var x = width/15;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width/2 + width/30, x);
        ctx.lineTo(width/2 + width/30, x+width/40);
        ctx.lineTo(0, width/75);
        ctx.closePath();
        ctx.fill();
    }
    colors = ['red', 'orange', 'yellow', 'greenyellow',
              'lightskyblue', 'blueviolet'];
    for (color in colors)
    {
        ctx.rotate(0.02);
        ctx.translate(0, p_width/30);
        ctx.save();
        ctx.translate(width/15, 0);
        ctx.fillStyle = colors[color];
        disp_beam();
        ctx.restore();
    }
    ctx.restore();
}

function prism(ctx, x)
{
    // O = Tan(Theta) * A
    // m = Tan(PI/6) * 1/2x
    m = (x/2) * (1/Math.sqrt(3));

    // linear gradient
    var lingrad = ctx.createLinearGradient(0, 0, 0, m);
    lingrad.addColorStop(0.75, 'black');
    lingrad.addColorStop(0.90, 'SlateGray');
    lingrad.addColorStop(0.95, 'LightSlateGray');
    lingrad.addColorStop(1, 'WhiteSmoke');
    ctx.fillStyle = lingrad;
    ctx.strokeStyle = lingrad;

    ctx.save()
    triangle(ctx, x, m);
    ctx.rotate(Math.PI * (2/3));
    triangle(ctx, x, m);
    ctx.rotate(Math.PI * (2/3));
    triangle(ctx, x, m);
    ctx.restore();
}

function draw()
{
    var canvas = document.getElementById("thecanvas");
    var ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var height = canvas.height;
    var width = canvas.width;

    // Background
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    // Create coloured beams
    var x = Math.max(width/2.75, height/2.75);
    colour_beam(ctx, width, height, x);

    // Create prism
    prism_xpos = width/2;
    prism_ypos = height/2 - x/6;
    ctx.save();
    ctx.translate(prism_xpos, prism_ypos);
    prism(ctx, x);
    ctx.restore();

    // Create white beam
    beam(ctx, width, height);
            }
