
from flask import Flask, jsonify, request

app = Flask(__name__)

messages = []

@app.route('/send', methods=['POST'])
def send_message():
    content = request.json
    messages.append(content['message'])
    return jsonify({'status': 'success'})

@app.route('/receive', methods=['GET'])
def receive_messages():
    return jsonify(messages)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
