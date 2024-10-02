"use strict";

let gl;
let program;

let vao1;
let vao2;
let vao3;

let modelMatrix = mat4(1.0);
let modelMatrixTeapot = mat4(1.0);
let modelMatrixSonne = mat4(1.0);
let viewMatrix = mat4(1.0);
let viewMatrixTeapot = mat4(1.0);
let projectionMatrix = mat4(1.0);

let sphere;
let vertexCounter;

function createGeometry() {

    // erstellen eines VAO für die Pyramide
    vao1 = gl.createVertexArray();
    gl.bindVertexArray(vao1);

    // init der Flächen

    let positions = [
        // Bodendreieck 1
        0.5, 0.0, 0.5,
        0.5, 0.0, -0.5,
        -0.5, 0.0, 0.5,

        // Bodendreieick 2
        0.5, 0.0, -0.5,
        -0.5, 0.0, 0.5,
        -0.5, 0.0, -0.5,

        // Seite 1
        0.5, 0.0, 0.5,
        0.5, 0.0, -0.5,
        0.0, -0.5, 0.0,

        // Seite 2
        0.5, 0.0, -0.5,
        -0.5, 0.0, -0.5,
        0.0, -0.5, 0.0,

        // Seite 3
        -0.5, 0.0, -0.5,
        -0.5, 0.0, 0.5,
        0.0, -0.5, -0.0,

        // Seite 4
        0.5, 0.0, 0.5,
        -0.5, 0.0, 0.5,
        0.0, -0.5, 0.0
    ];

    // laden der Vertices der Pyramide
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(0);

    // init der Farben
    var colors = [];
    for (var j = 0; j < positions.length; ++j) {
        colors = colors.concat([1.0, 0.0, 0.0]);
    }

    // laden der Farben der Pyramide
    let vboColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboColor);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(1);

    // init der Normalen
    let normals = [
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,


        -0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,

        0.0, 0.5, 0.5,
        0.0, 0.5, 0.5,
        0.0, 0.5, 0.5,

        0.5, 0.5, 0.0,
        0.5, 0.5, 0.0,
        0.5, 0.5, 0.0,

        0.0, -0.5, 0.5,
        0.0, -0.5, 0.5,
        0.0, -0.5, 0.5
    ];

    // laden der Normalen der Pyramide
    let vboNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboNormal);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(2);

}

function loadModel() {
    let modelData = loadObj(teapotModel);
    let meshData = loadMeshData(modelData[0], "Teapot");
    let positions = meshData.positions;
    let normals = meshData.normals;
    let colors = meshData.colors;
    vertexCounter = meshData.vertexCount;

    // erstellen eines VAO für den Teapot
    vao2 = gl.createVertexArray();
    gl.bindVertexArray(vao2);

    // laden der Vertices des Teapots
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(0);

    // laden der Farbe des Teapots
    let vboColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboColor);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(1);

    // laden der Normalen des Teapots
    let vboNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboNormal);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(2);
}

function loadSphere() {

    // erstellen eines VAO für die Sonne
    vao3 = gl.createVertexArray();
    gl.bindVertexArray(vao3);

    // --- Funktionalität aus Sphere.js zum erstellen der Sonne ----
    // ---------- von Song Ho Ahn (song.ahn@gmail.com) -------------
    sphere = new Sphere(gl, 1, 36, 18, false);

    sphere.setRadius(0.1);
    sphere.setSectorCount(8);
    sphere.setStackCount(4);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(0);
    // ---------------------------------------

    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vboVertex);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, sphere.stride, 0);

    // erstellen der Farbe der Sonne
    var colors = [];
    for (var j = 0; j < sphere.getIndexCount(); ++j) {
        colors = colors.concat([1.0, 1.0, 0.0]);
    }

    // laden der Farbe der Sonne
    let vboColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboColor);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(1);

}

function render(timestamp, previousTimestamp) {
    let light = getLightPosition(); // vec3
    let rotation = getRotation(); // vec3

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);

    // runterskalieren der Drehgeschwindigkeit
    let alphax = rotation[0] * 0.01;
    let alphay = rotation[1] * 0.01;
    let alphaz = rotation[2] * 0.01;

    // Rotations Matrix x
    let rot_x = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, Math.cos(alphax), -Math.sin(alphax), 0.0,
        0.0, Math.sin(alphax), Math.cos(alphax), 0.0,
        0.0, 0.0, 0.0, 1.0
    )

    // Rotations Matrix y
    let rot_y = mat4(
        Math.cos(alphay), 0.0, Math.sin(alphay), 0.0,
        0.0, 1.0, 0.0, 0.0,
        -Math.sin(alphay), 0.0, Math.cos(alphay), 0.0,
        0.0, 0.0, 0.0, 1.0
    )

    // Rotations Matrix z
    let rot_z = mat4(
        Math.cos(alphaz), -Math.sin(alphaz), 0.0, 0.0,
        Math.sin(alphaz), Math.cos(alphaz), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    )

    // Rotation der Modelmatrix
    modelMatrix = mult(rot_x, mult(rot_y, mult(rot_z, modelMatrix)));
    modelMatrixTeapot = mult(rot_x, mult(rot_y, mult(rot_z, modelMatrixTeapot)));

    let normalMatrix = transpose(inverse(mult(viewMatrix, modelMatrix)));

    // senden der Matritzen an die Shader (Pyramide)
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'projectionMatrix'), false, flatten(projectionMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'viewMatrix'), false, flatten(viewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'modelMatrix'), false, flatten(modelMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'normalMatrix'), false, flatten(normalMatrix));
    gl.uniform3fv(gl.getUniformLocation(program, 'lightPos'), flatten(light));

    gl.bindVertexArray(vao1);
    gl.drawArrays(gl.TRIANGLES, 0, 18); // zeichnet alle Vertecies

    // senden der veränderten ModelMatrix an die Shader um nur Teapot zu verschieben
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'modelMatrix'), false, flatten(modelMatrixTeapot));

    gl.bindVertexArray(vao2);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCounter);

    console.log(getLightPosition());

    gl.bindVertexArray(vao3);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.vboIndex);

    // verschieben der Sonne
    let t3 = mat4(
        1, 0, 0, light[0],
        0, 1, 0, light[1],
        0, 0, 1, light[2],
        0, 0, 0, 1);

    modelMatrixSonne = mult(t3, modelMatrix);

    // anpassen der Modelmatrix für die Sonne
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'modelMatrix'), false, flatten(modelMatrixSonne));
    gl.drawElements(gl.TRIANGLES, sphere.getIndexCount(), gl.UNSIGNED_SHORT, 0);

    window.requestAnimFrame(function (time) {
        render(time, timestamp);
    });
}

window.onload = function init() {
    let canvas = document.getElementById("rendering-surface");
    gl = WebGLUtils.setupWebGL(canvas);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    createGeometry();
    loadModel();
    loadSphere(); // erstellen der Sonne

    projectionMatrix = perspective(60, canvas.width / canvas.height, 0.1, 100);

    let eyePos = vec3(0.75, 0.25, 3);
    let lookAtPos = vec3(0.0, 0.0, 0.0);
    let upVector = vec3(0.0, 1.0, 0.0);
    viewMatrix = lookAt(eyePos, lookAtPos, upVector, vec3(0, 0, 0));
    viewMatrixTeapot = lookAt(eyePos, lookAtPos, upVector, vec3(0, 0, 0));

    // Translations Pyramiden Matrix
    let t1 = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, -0.5,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    // verschieben des Teapots etwas nach oben
    let t2 = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.035,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    // Scale Matrix
    let s1 = mat4(
        2.0, 0.0, 0.0, 0.0,
        0.0, 2.0, 0.0, 0.0,
        0.0, 0.0, 2.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    // Verschieben der Sonne
    let t3 = mat4(
        1.0, 0.0, 0.0, getLightPosition()[0],
        0.0, 1.0, 0.0, getLightPosition()[1],
        0.0, 0.0, 1.0, getLightPosition()[2],
        0.0, 0.0, 0.0, 1.0
    );

    // Anwenden der Scale und Translationsmatrix auf die Modelmatrix von Pyramide, Teapot und Sonne
    modelMatrix = mult(t1, mult(s1, modelMatrix));
    modelMatrixTeapot = mult(t2, mult(s1, modelMatrixTeapot));
    modelMatrixSonne = mult(t3, modelMatrixSonne);

    render(0, 0);
};
