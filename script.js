// Configuração do stage e layer
const stage = new Konva.Stage({
    container: 'map-container',
    width: window.innerWidth,
    height: window.innerHeight
});
const connections = []; // Array de conexões
const layer = new Konva.Layer();
stage.add(layer);
let connectingNodeId = null; // Armazenar o ID do campo de texto de partida da conexão

function onNodeClick(nodeId) {
    if (connectingNodeId === null) {
        connectingNodeId = nodeId;
    } else {
        if (connectingNodeId !== nodeId) {
            // Criar uma conexão entre os campos
            const newConnection = { from: connectingNodeId, to: nodeId };
            connections.push(newConnection);

            // Chamar função para desenhar as conexões
            drawConnections();

            connectingNodeId = null; // Reiniciar para permitir futuras conexões
        }
    }
}
function drawConnections() {
    // Limpar todas as conexões existentes
    try {
        layer.find('.connection').destroy();
    } catch (error) {}

    // Desenhar as novas conexões
    for (const connection of connections) {
        const fromNode = textFields.find(node => node.id() === connection.from);
        const toNode = textFields.find(node => node.id() === connection.to);

        if (fromNode && toNode) {
            const connector = new Konva.Line({
                points: [fromNode.x(), fromNode.y(), toNode.x(), toNode.y()],
                stroke: 'black',
                strokeWidth: 2,
                lineCap: 'round',
                lineJoin: 'round',
                id: 'connection'
            });

            layer.add(connector);
        }
    }

    layer.draw();
}

// Função para criar campo de texto redimensionável
function createResizableText(x, y) {
    const textGroup = new Konva.Group({
        x: x,
        y: y,
        draggable: true,
        width: 200,
        height: 100
    });

    const textBackground = new Konva.Rect({
        width: 200,
        height: 100,
        fill: '#f0f0f0',
        cornerRadius: 10
    });

    const textNode = new Konva.Text({
        text: 'Digite aqui',
        fontSize: 18,
        padding: 10,
        align: 'center',
        verticalAlign: 'middle',
        wrap: 'word'
    });

    textNode.on('dblclick', () => {
        // Hide text node and show textarea
        textNode.hide();
        layer.draw();

        const textPosition = textNode.getAbsolutePosition();

        const textarea = document.createElement('textarea');
        textarea.style.position = 'absolute';
        textarea.style.top = textPosition.y + 'px';
        textarea.style.left = textPosition.x + 'px';
        textarea.style.width = textBackground.width() + 'px';
        textarea.style.height = textBackground.height() + 'px';
        textarea.value = textNode.text();
        document.body.appendChild(textarea);

        textarea.addEventListener('input', () => {
            textNode.text(textarea.value);
            layer.draw();
        });

        textarea.addEventListener('blur', () => {
            textNode.text(textarea.value);
            layer.draw();
            textarea.remove();
            textNode.show();
        });

        textarea.focus();
    });

    textGroup.on('click', () => {
        onNodeClick(textGroup.id());
    });

    textGroup.add(textBackground);
    textGroup.add(textNode);
    layer.add(textGroup);
    layer.draw();

    // Adicionar redimensionamento
    textGroup.on('transform', () => {
        const scaleX = textGroup.scaleX();
        const scaleY = textGroup.scaleY();

        textBackground.width(textBackground.width() * scaleX);
        textBackground.height(textBackground.height() * scaleY);

        textNode.width(textBackground.width() - 20);
        textNode.height(textBackground.height() - 20);

        textGroup.scaleX(1);
        textGroup.scaleY(1);
        layer.draw();
    });

    textGroup.on('dragmove', () => {
        textBackground.width(textNode.width() + 20);
        textBackground.height(textNode.height() + 20);
    });
}

let textFields = [];
// Função para adicionar novo campo de texto
function addRectangle() {
    const x = Math.random() * stage.width();
    const y = Math.random() * stage.height();

    const newText = createResizableText(x, y);
    textFields.push(newText);
    drawConnections();
}
