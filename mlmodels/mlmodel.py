from flask import Flask, request, jsonify
import requests
import numpy as np
from sklearn.linear_model import LinearRegression
from flask_cors import CORS 
app = Flask(__name__)
CORS(app)
@app.route('/forecast', methods=['POST'])
def get_data_from_server():
    try:
        url = 'http://localhost:3000/forecast/weather'
        data = request.json
        humidity = float(data.get('humidity'))
        pressure = float(data.get('pressure'))
        response = requests.get(url)
        if response.status_code == 200:
            server_data = response.json()
            new_temperature = predict_humidity(server_data, np.array([[humidity, pressure]]))
            return jsonify({'temperature': new_temperature})
        else:
            return jsonify({'error': 'Failed to retrieve data from server'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def predict_humidity(data, new_data):
    X = np.array([[entry['humidity'], entry['pressure']] for entry in data])
    y = np.array([entry['temperature'] for entry in data])

    model = LinearRegression()
    model.fit(X, y)

    predicted_humidity = model.predict(new_data)
    return predicted_humidity[0]


if __name__ == '__main__':
    app.run(debug=True)
