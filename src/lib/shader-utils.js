function initShaders(gl, vertexShaderId, fragmentShaderId) {
  let vertexShader;
  let fragmentShader;

  let vertexElement = document.getElementById(vertexShaderId);
  if (!vertexElement) {
    alert("Unable to load vertex shader " + vertexShaderId);
    return -1;
  } else {
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexElement.text);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      let message =
        "Vertex shader failed to compile.  The error log is:" +
        "<pre>" +
        gl.getShaderInfoLog(vertexShader) +
        "</pre>";
      alert(message);
      return -1;
    }
  }

  let fragmentElement = document.getElementById(fragmentShaderId);
  if (!fragmentElement) {
    alert("Unable to load vertex shader " + fragmentShaderId);
    return -1;
  } else {
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentElement.text);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      let message =
        "Fragment shader failed to compile.  The error log is:" +
        "<pre>" +
        gl.getShaderInfoLog(fragmentShader) +
        "</pre>";
      alert(message);
      return -1;
    }
  }

  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    let message =
      "Shader program failed to link.  The error log is:" +
      "<pre>" +
      gl.getProgramInfoLog(program) +
      "</pre>";
    alert(message);
    return -1;
  }

  return program;
}
