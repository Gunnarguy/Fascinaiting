from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/message', methods=['POST'])
def message():
       # Get the message from the request's form data
       message_text = request.form['message']

       # For now, we'll just echo the message back.
       # Here you would typically integrate with AI logic or database
       response_text = f"Echo: {message_text}"

       # Respond with JSON
       return jsonify({"response": response_text})

if __name__ == '__main__':
       app.run(host='0.0.0.0', port=5500)
