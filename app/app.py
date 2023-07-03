from flask import Flask, request
from embedchain.embedchain import App as EmbedChainApp
app = Flask(__name__)

@app.route('/', methods=['GET'])
def root():
  return 'Reporting from Root'

@app.route('/query', methods=['GET'])
def query():
  prompt: str = request.args.get('prompt')
  print(prompt)
  embedchain = EmbedChainApp()
  result = embedchain.query(prompt)
  print(result)
  return result

@app.route('/add', methods=['POST'])
def add():
  data = request.get_json()
  print(data['type'])
  embedchain = EmbedChainApp()
  result = embedchain.add(data['type'], data['content'])
  print(result)
  return result

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)
