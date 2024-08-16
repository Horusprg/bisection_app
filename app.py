from flask import Flask, render_template, request, jsonify
from sympy import sympify, symbols
import re

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/bisection', methods=['POST'])
def bisection():
    data = request.get_json()
    func_str = data['function']
    a = float(data['a'])
    b = float(data['b'])
    tol = float(data['tolerance'])
    max_iter = int(data['max_iter'])
    '''
    # Função para substituir \frac{a}{b} por a/b
    def latex_frac_to_div(match):
        numerador = match.group(1)
        denominador = match.group(2)
        return f"({numerador})/({denominador})"

    # Substituição de frações LaTeX
    func_str = re.sub(r'\\frac\{([^\{\}]*)\}\{([^\{\}]*)\}', latex_frac_to_div, func_str)

    # Substituições manuais para garantir compatibilidade
    func_str = func_str.replace('e^', 'exp')
    func_str = func_str.replace('\\exponentialE^', 'exp')
    func_str = func_str.replace('{', '(')
    func_str = func_str.replace('}', ')')
    func_str = func_str.replace('^', '**')
    func_str = func_str.replace('\\cdot', '*') 
    func_str = func_str.replace('\\ln', 'log')
    func_str = func_str.replace('\\sin', 'sin')
    func_str = func_str.replace('\\cos', 'cos')
    func_str = func_str.replace('\\tan', 'tan')
    func_str = func_str.replace('\\sinh', 'sinh')
    func_str = func_str.replace('\\cosh', 'cosh')
    func_str = func_str.replace('\\tanh', 'tanh')
    func_str = func_str.replace('\\sqrt', 'sqrt')'''
    
    x = symbols('x')
    f = sympify(func_str)

    # Converter a função string para uma função Python
    def f_eval(x_val):
        return float(f.subs(x, x_val))

    root, iterations, intervals = bisection_method(f_eval, a, b, tol, max_iter)
    return jsonify({'root': root, 'iterations': iterations, 'intervals': intervals})

def bisection_method(f, a, b, tol, max_iter):
    if f(a) * f(b) >= 0:
        step_size = 0.1  # Passo menor para maior precisão
        for i in range(-1000, 1000):  # Ajustar o limite conforme o step
            x1 = i * step_size
            x2 = (i + 1) * step_size
            if f(x1) * f(x2) <= 0:
                return None, 1, [x1, x2]
        return None, 0, []

    iteration = 0
    c = a
    intervals = []
    while (b-a) / 2.0 > tol and iteration < max_iter:
        c = (a+b) / 2.0
        intervals.append((a, b, c))  # Armazena os intervalos e o ponto médio
        if f(c) == 0:
            break
        if f(a) * f(c) < 0:
            b = c
        else:
            a = c
        iteration += 1
    return c, iteration, intervals

if __name__ == '__main__':
    app.run(debug=True)
