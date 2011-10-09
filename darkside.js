// Dark Side of the Moon

function triangle(ctx, width, height) 
{
    function triang()
    {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-width/2, height);
        ctx.lineTo(width/2, height);
        ctx.closePath();
    }
    triang();
    ctx.fill();

    triang();
    ctx.stroke();
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
    ctx.lineWidth = 1;

    // Need 3 triangles to get the gradient right.
    ctx.save();
    triangle(ctx, x, m);
    ctx.rotate(Math.PI * (2/3));
    triangle(ctx, x, m);
    ctx.rotate(Math.PI * (2/3));
    triangle(ctx, x, m);
    ctx.restore();
}

function intersection(x1, x2, y1, y2, x3, x4, y3, y4)
{
    // Thickepedia
    var px_t = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4));
    var px_b = ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    var py_t = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4));
    var py_b = ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));

    var px = px_t / px_b;
    var py = py_t / py_b;
    return [px, py];
}
    
function inner_beam(ctx, px, py, px2, py2, px3, py3)
{
    ctx.save();
    // Calculate linewidth
    var lingrad = ctx.createLinearGradient(px, 0, px2, 0);
    lingrad.addColorStop(0, 'White');
    lingrad.addColorStop(0.2, 'SlateGray');
    lingrad.addColorStop(0.5, 'black');
    lingrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lingrad;

    // Inner Beam
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px2, py2);
    ctx.lineTo(px3, py3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
    
function caustics(ctx, width, height, x)
{
    // Save
    ctx.save();

    // Calculate target
    m = (x/2) * (1/Math.sqrt(3));
    y_mid = height/2 - m;

    // Calculate linewidth
    ctx.strokeStyle = 'white';
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, Math.max(width, height)/300);

    // Calculate point of intersection
    x1 = 0;
    x2 = width/2;
    y1 = y_mid + (3*m/2);
    y2 = y_mid;

    // Triangle side
    x3 = width/2 - x/2;
    y3 = height/2 + m;
    x4 = width/2;
    y4 = y_mid - m;

    // BOUNCY BOUNCY
    // PI/6
    // x1 = 0 still, need to calculate y1
    y1 = y_mid + width/2 * Math.sin(Math.PI/8);

    // BOUNCY BOUNCY

    p = intersection(x1, x2, y1, y2, x3, x4, y3, y4);
    px = p[0];
    py = p[1];

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Inside beam
    // Not physically realistic, yet.
    x4 = px;
    y4 = py;

    // Pick a point to the other side.
    x5 = px + m;
    y5 = py - m/8;

    // Right side of triangle
    x6 = width/2;
    y6 = y_mid - m;
    x7 = width/2 + x/2;
    y7 = height/2 + m;

    p2 = intersection(x4, x5, y4, y5, x6, x7, y6, y7);
    px2 = p2[0];
    py2 = p2[1];

    // Another ray
    x8 = px;
    y8 = py;

    // Pick a point to the other side.
    x9 = px + m;
    y9 = py + m/4

    p3 = intersection(x4, x9, y4, y9, x6, x7, y6, y7);
    px3 = p3[0];
    py3 = p3[1];

    inner_beam(ctx, px, py, px2, py2, px3, py3);

    // Calculate top right intersection
    p4 = intersection(x4, x5, y4, y5+m/6, width, width, 0, height);
    p5 = intersection(x4, x9, y4, y9, width, width, 0, height);
    // Calculate bottom right intersection

    // Coloured Beams
    // Create Points
    var left_x_delta = (px2 - px3) / 7;
    var left_y_delta = (py2 - py3) / 7;

    var right_x_delta = (p4[0] - p5[0]) / 7;
    var right_y_delta = (p4[1] - p5[1]) / 7;

    var colours = ['red', 'orange', 'yellow', 'greenyellow',
              'lightskyblue', 'blueviolet'];
    for (var i = 0; i < 6; i++)
    {
        var tl = [px2 - i * left_x_delta, py2 - i * left_y_delta];
        var bl = [px2 - (i+1) * left_x_delta, py2 - (i + 1) * left_y_delta];
        var tr = [p4[0] - i * right_x_delta, p4[1] - i * right_y_delta];
        var br = [p4[0] - (i+1) * right_x_delta, p4[1] - (i + 1) * right_y_delta];

        ctx.fillStyle = colours[i];
        ctx.strokeStyle = colours[i];
        ctx.beginPath();
        ctx.moveTo(1+tl[0], tl[1]);
        ctx.lineTo(tr[0], tr[1]);
        ctx.lineTo(br[0], br[1]);
        ctx.lineTo(1+bl[0], bl[1]);
        ctx.closePath();
        ctx.fill();

        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(1+tl[0], tl[1]);
        ctx.lineTo(tr[0], tr[1]);
        ctx.lineTo(br[0], br[1]);
        ctx.lineTo(1+bl[0], bl[1]);
        ctx.closePath();
        ctx.stroke();
    }
    ctx.restore();
}

function draw()
{
    // Setup canvas
    var canvas = document.getElementById("thecanvas");
    var ctx = canvas.getContext("2d");

    var width = window.innerWidth;
    var height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);

    var x = 3/5 * Math.min(width, height);

    // Create prism
    prism_xpos = width/2;
    prism_ypos = height/2; 
    ctx.save();
    ctx.translate(prism_xpos, prism_ypos);
    prism(ctx, x);
    ctx.restore();

    // Create white beam
    caustics(ctx, width, height, x);
}
