class Canvas{
    constructor(container, rendering) {
        this.container = document.querySelector(container);
        this.width = 0;
        this.height = 0;
        this.defaultColor = 'white';
        this.defaultFont = "Arial";
        this.defaultFontSize = "20px";
        this.currentColor = 'white';
        this.positions = [];
        this.rendering = rendering;
        this.createCanvas('500px', '500px');

    }

    fullScreen() {
        document.documentElement.requestFullscreen();
        this.setDimensions(document.body.clientWidth, document.body.clientHeight)
    }

    exitFullScreen() {}

    createCanvas(width, height) {
        this.canvas = document.createElement('canvas')
        this.canvas.style = 'border:solid 1px black';
        // this.canvas.style.width = width;
        // this.canvas.style.height = height;
        this.container.append(this.canvas);


        if (this.rendering === '2d') {

            this.context = this.canvas.getContext('2d');
            return;
        }

        this.context = this.canvas.getContext(
            'webgl',
            {
                antialias: false,
            }
        );

        // setup GLSL program
        this.program = webglUtils.createProgramFromScripts(this.context, ["vertex-shader-2d", "fragment-shader-2d"]);

        // look up where the vertex data needs to go.
        this.positionLocation = this.context.getAttribLocation(this.program, "a_position");

        // lookup uniforms
        this.resolutionLocation = this.context.getUniformLocation(this.program, "u_resolution");
        this.colorLocation = this.context.getUniformLocation(this.program, "u_color");

        // Create a buffer to put positions in
        this.positionBuffer = this.context.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.positionBuffer);
        // this.context = this.canvas.getContext('webgl',);
    }

    write = (text, x, y) => {
        this.context.fillStyle = this.defaultColor;
        this.context.fillText(text, x, y);
    }

    setFillColor = (color = this.defaultColor) => {
        this.context.fillStyle = color;
    }

    setFont = (font = this.defaultFont, size = this.defaultFontSize) => {
        this.context.font = `${font} ${size}`;
    }

    draw = (x = 0, y = 0, w = 0, h = 0, color = 'red') => {
        // console.log(color);
        if (this.rendering === '2d') {
            if (this.currentColor !== color) {
                this.context.fillStyle = color;
            }
            this.context.fillRect(x, y, w, h);

            return;
        }

        let colorValues = color.replace('rgb(', '').replace(')', '').split(',');

        color = [colorValues[0]/255, colorValues[1]/255, colorValues[2]/255, 1];

        let x1 = x;
        let x2 = x + w;
        let y1 = y;
        let y2 = y + h;
        this.positions.push(
            {
                'positions':  new Float32Array([
                    x1, y1,
                    x2, y1,
                    x1, y2,
                    x1, y2,
                    x2, y1,
                    x2, y2,
                ]),
                'color': color,
            }
        );

    }

    renderScene() {
        if (this.rendering === '2d') {
            return;
        }
        webglUtils.resizeCanvasToDisplaySize(this.context.canvas);

        // Tell WebGL how to convert from clip space to pixels
        this.context.viewport(0, 0, this.context.canvas.width, this.context.canvas.height);

        // Clear the canvas.
        this.context.clearColor(0, 0.2, 0.3, 0);
        this.context.clear(this.context.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        this.context.useProgram(this.program);

        // Turn on the attribute
        this.context.enableVertexAttribArray(this.positionLocation);

        // Bind the position buffer.
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.positionBuffer);

        // Setup a rectangle
        this.positions.forEach(object => {
            this.context.bufferData(
                this.context.ARRAY_BUFFER,
                object.positions,
                this.context.STATIC_DRAW);

            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            let size = 2;          // 2 components per iteration
            let type = this.context.FLOAT;   // the data is 32bit floats
            let normalize = false; // don't normalize the data
            let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            let offset = 0;        // start at the beginning of the buffer
            this.context.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);

            // set the resolution
            this.context.uniform2f(this.resolutionLocation, this.context.canvas.width, this.context.canvas.height);

            // set the color
            this.context.uniform4fv(this.colorLocation, object.color);

            // Draw the rectangle.
            let primitiveType = this.context.TRIANGLES;
            offset = 0;
            let count = 6;
            this.context.drawArrays(primitiveType, offset, count);
        })
    }

    clear() {
        this.positions = [];
        if (this.rendering === '2d') {
            this.context.clearRect(0, 0, this.width, this.height);

        }
    }

    initShaderProgram() {
        const vsSource = `
            attribute vec4 aVertexPosition;
        
            uniform mat4 uModelViewMatrix;
            uniform mat4 uProjectionMatrix;
        
            void main() {
              gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
            }
      `;
        const fsSource = `
            void main() {
              gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
      `;

        const vertexShader = this.loadShader(this.context.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(this.context.FRAGMENT_SHADER, fsSource);

        // Create the shader program

        const shaderProgram = this.context.createProgram();
        this.context.attachShader(shaderProgram, vertexShader);
        this.context.attachShader(shaderProgram, fragmentShader);
        this.context.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (!this.context.getProgramParameter(shaderProgram, this.context.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + this.context.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    loadShader(type, source) {
        const shader = this.context.createShader(type);

        // Send the source to the shader object

        this.context.shaderSource(shader, source);

        // Compile the shader program

        this.context.compileShader(shader);

        // See if it compiled successfully

        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + this.context.getShaderInfoLog(shader));
            this.context.deleteShader(shader);
            return null;
        }

        return shader;
    }

    setDimensions(width, height) {
        this.width = width;
        this.height = height;

        this.canvas.width = width;
        this.canvas.height = height;
    }

    addListener(type, callback) {
        document.addEventListener(type, callback);
    }
}
