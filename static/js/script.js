document.addEventListener('DOMContentLoaded', function() {
    const mathField = document.getElementById('function');

    // Evento de foco para exibir o teclado virtual
    mathField.addEventListener('focusin', function() {
        mathField.executeCommand('showVirtualKeyboard');
    });

    // Esconde o teclado ao clicar fora do math-field
    mathField.addEventListener('focusout', function(event) {
        if (!mathField.contains(event.target)) {
            mathField.executeCommand('hideVirtualKeyboard');
        }
    });
});

document.getElementById('bisection-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let functionInput = document.getElementById('function').getValue('latex');
    // Conversão básica de LaTeX para expressão matemática
    functionInput = latex_to_js(functionInput)
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const tolerance = parseFloat(document.getElementById('tolerance').value);
    const max_iter = parseInt(document.getElementById('max_iter').value);

    fetch('/bisection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ function: functionInput, a: a, b: b, tolerance: tolerance, max_iter: max_iter })
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('result');
        if (data.root === null && data.iterations === 1) {
            resultDiv.innerHTML = `<b>Result:</b><br><br>No root found.<br>A root was finded in the interval [${data.intervals[0]}, ${data.intervals[1]}].<br>Expand the intervals to find a root.`;
        } else if (data.root === null && data.iterations === 0) {
            resultDiv.innerHTML = `<b>Result:</b><br><br>No root found.<br>Expand the intervals to find a root.`;
        } else {
            resultDiv.innerHTML = `<b>Result:</b><br><br>Root found: ${data.root}<br>Iterations: ${data.iterations}`;
            // Plot the function with the bisection intervals and root
            plotGraph(functionInput, data.intervals, data.root);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function plotGraph(funcStr, intervals, root) {
    
    console.log("Function String: ", funcStr);
    const a = Math.min(...intervals.map(interval => interval[0]));
    const b = Math.max(...intervals.map(interval => interval[1]));
    const x = Array.from({length: 1000}, (v, k) => a + k * (b - a) / 1000);
    const expr = math.compile(funcStr);
    const y = x.map(xi => expr.evaluate({x: xi}));

    const trace1 = {
        x: x,
        y: y,
        mode: 'lines',
        name: 'Function',
    };

    const trace2 = {
        x: [],
        y: [],
        text: [], 
        mode: 'markers+text',
        textposition: 'top center',
        marker: {
            color: 'orange',
            size: 8,
        },
        name: 'Iterations',
    };

    const trace3 = {
        x: [root],
        y: [expr.evaluate({ x: root })],
        mode: 'markers',
        marker: {
            color: 'red',
            size: 20,
            symbol: 'circle',
        },
        name: 'Root',
    };

    const layout = {
        title: 'Bisection Method Visualization',
        xaxis: { title: 'x' },
        yaxis: { title: 'f(x)' },
        showlegend: true,
        autosize: false,  // Defina como false para permitir o uso de width e height
        width: 900,      // Largura do gráfico
        height: 600,      // Altura do gráfico
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        },
    };
    
    // Plota o gráfico inicial
    Plotly.newPlot('plot', [trace1, trace2, trace3], layout).then(() => {
        // Redimensiona o gráfico para caber na div
        Plotly.relayout('plot', {
            'xaxis.autorange': true,
            'yaxis.autorange': true,
        });
    });

    let iterationIndex = 0;
    const intervalId = setInterval(() => {
        if (iterationIndex < intervals.length) {
            const [a, b, c] = intervals[iterationIndex];
            trace2.x.push(c);
            trace2.y.push(expr.evaluate({ x: c }));
            trace2.text.push(`Iter ${iterationIndex + 1}`);

            Plotly.animate('plot', {
                data: [trace1, trace2, trace3],
            }, {
                transition: {
                    duration: 800,
                    easing: 'cubic-in-out',
                },
                frame: {
                    duration: 800,
                    redraw: false,
                }
            });

            iterationIndex++;
        } else {
            clearInterval(intervalId);
            trace3.x = [root];
            trace3.y = [expr.evaluate({ x: root })];

            Plotly.animate('plot', {
                data: [trace1, trace2, trace3],
            }, {
                transition: {
                    duration: 800,
                    easing: 'cubic-in-out',
                },
                frame: {
                    duration: 800,
                    redraw: true,
                }
            });
        }
    }, 1000);
}
