function loadObj(data) {
  let models = [];
  let currentGroup = "";

  const lines = data.split("\n");
  for (let i = 0; i < lines.length; ++i) {
    const commentIndex = lines[i].indexOf("#");
    const line =
      commentIndex > -1 ? lineString.substring(0, commentIndex) : lines[i];

    const lineItems = line.replace(/\s\s+/g, " ").trim().split(" ");

    switch (lineItems[0].toLowerCase()) {
      case "o": {
        // Object
        const modelName = lineItems.length >= 2 ? lineItems[1] : "Unknown";
        models.push({
          name: modelName,
          positions: [],
          textureCoords: [],
          normals: [],
          faces: [],
        });
        currentGroup = "";
        break;
      }
      case "g": {
        // Group
        if (lineItems.length != 2) {
          throw "Group statements must have exactly 1 argument (eg. g group_1)";
        }
        currentGroup = lineItems[1];
        break;
      }
      case "v": {
        // Vertex
        const x = lineItems.length >= 2 ? parseFloat(lineItems[1]) : 0.0;
        const y = lineItems.length >= 3 ? parseFloat(lineItems[2]) : 0.0;
        const z = lineItems.length >= 4 ? parseFloat(lineItems[3]) : 0.0;
        models[models.length - 1].positions.push([ x, y, z ]);
        break;
      }
      case "vt": {
        // Texture coordinate
        const u = lineItems.length >= 2 ? parseFloat(lineItems[1]) : 0.0;
        const v = lineItems.length >= 3 ? parseFloat(lineItems[2]) : 0.0;
        const w = lineItems.length >= 4 ? parseFloat(lineItems[3]) : 0.0;
        models[models.length - 1].textureCoords.push([ u, v, w ]);
        break;
      }
      case "vn": {
        // Normal
        const x = lineItems.length >= 2 ? parseFloat(lineItems[1]) : 0.0;
        const y = lineItems.length >= 3 ? parseFloat(lineItems[2]) : 0.0;
        const z = lineItems.length >= 4 ? parseFloat(lineItems[3]) : 0.0;
        models[models.length - 1].normals.push([ x, y, z ]);
        break;
      }
      case "f": {
        // Face
        const vertexCount = lineItems.length - 1;
        if (vertexCount < 3) {
          throw `Face statement has less than 3 vertices (line ${i}: ${line})`;
        }

        const face = {
          group: currentGroup,
          vertices: [],
        };

        for (let i = 0; i < vertexCount; ++i) {
          const vertexString = lineItems[i + 1];
          const vertexValues = vertexString.split("/");

          if (vertexValues.length < 1 || vertexValues.length > 3) {
            throw `Too many values (separated by /) for a single vertex (line ${i}: ${line})`;
          }

          let vertexIndex = 0;
          let textureCoordsIndex = 0;
          let normalIndex = 0;
          vertexIndex = parseInt(vertexValues[0]);
          if (vertexValues.length > 1 && vertexValues[1] != "") {
            textureCoordsIndex = parseInt(vertexValues[1]);
          }
          if (vertexValues.length > 2) {
            normalIndex = parseInt(vertexValues[2]);
          }

          if (vertexIndex == 0) {
            throw "Faces uses invalid vertex index of 0";
          }

          // Negative vertex indices refer to the nth last defined vertex
          // convert these to postive indices for simplicity
          if (vertexIndex < 0) {
            vertexIndex =
              models[models.length - 1].vertices.length + 1 + vertexIndex;
          }

          face.vertices.push({
            vertexIndex: vertexIndex - 1,
            textureCoordsIndex: textureCoordsIndex - 1,
            normalIndex: normalIndex - 1,
          });
        }
        models[models.length - 1].faces.push(face);
        break;
      }
      default:
        break;
    }
  }

  return models;
}
