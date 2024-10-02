function loadMeshData(model, groupName) {
  let positions = [];
  let normals = [];
  let count = 0;

  let minX = Number.MAX_VALUE;
  let maxX = -Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let maxY = -Number.MAX_VALUE;
  let minZ = Number.MAX_VALUE;
  let maxZ = -Number.MAX_VALUE;

  for (let i = 0; i < model.faces.length; ++i) {
    const face = model.faces[i];
    if (face.group !== groupName || face.vertices.length !== 3) {
      continue;
    }

    for (let j = 0; j < face.vertices.length; ++j) {
      const vertices = face.vertices[j];

      const position = model.positions[vertices.vertexIndex];
      minX = Math.min(position[0], minX);
      maxX = Math.max(position[0], maxX);
      minY = Math.min(position[1], minY);
      maxY = Math.max(position[1], maxY);
      minZ = Math.min(position[2], minZ);
      maxZ = Math.max(position[2], maxZ);

      Array.prototype.push.apply(positions, position);
      Array.prototype.push.apply(normals, normalize(model.normals[vertices.normalIndex]));
    }

    count += 3;
  }

  const maxRange = Math.max(maxX - minX, Math.max(maxY - minY, maxZ - minZ));
  for (let i = 0; i < positions.length; ++i) {
    positions[i] /= maxRange;
  }

  let colors = [];
  for (let i = 0; i < count; ++i) {
    colors.push(0.65, 0.8, 0.89);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
    vertexCount: count,
  };
}

function getRotation() {
  let rotateX = document.getElementById("rotate-x").value;
  let rotateY = document.getElementById("rotate-y").value;
  let rotateZ = document.getElementById("rotate-z").value;

  return vec3(rotateX, rotateY, rotateZ);
}

function getLightPosition() {
  let light = vec3(
    (document.getElementById("light-x").value) / 10.0,
    (document.getElementById("light-y").value) / 10.0,
    (document.getElementById("light-z").value) / 10.0
  );

  return light;
}
