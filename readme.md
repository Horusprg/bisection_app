# Método da Bisseção com Flask

Este projeto implementa um método numérico para encontrar raízes de funções utilizando o Método da Bisseção. A interface foi desenvolvida com Flask e permite ao usuário inserir uma função matemática e os parâmetros necessários para o cálculo da raiz. O resultado é exibido diretamente na interface.

## Funcionalidades

- Entrada de funções matemáticas em formato string.
- Substituições de símbolos matemáticos para compatibilidade com o SymPy.
- Execução do Método da Bisseção para encontrar raízes de funções.
- Retorno da raiz encontrada, número de iterações realizadas e intervalos calculados durante o processo.

## Tecnologias Utilizadas

- **Flask**: Um micro framework para Python, usado para construir a interface web.
- **SymPy**: Uma biblioteca de Python para manipulação simbólica de expressões matemáticas.
- **JavaScript**: Utilizado para enviar dados de entrada e receber os resultados do servidor Flask.

## Como Executar o Projeto

1. **Clone o repositório**:

   ```bash
    git clone https://github.com/seu-usuario/metodo-bissecao-flask.git
    cd metodo-bissecao-flask

2. **Crie um ambiente virtual e ative-o**:

   ```bash
    python -m venv venv
    source venv/bin/activate  # No Windows use: venv\Scripts\activate

3. **Instale as dependências**:

   ```bash
    pip install -r requirements.txt

4. **Execute a aplicação**:

   ```bash
   python app.py