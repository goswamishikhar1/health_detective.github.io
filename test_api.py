import requests
import json

API_URL = 'https://health-detective-api.onrender.com'

def test_root():
    print('Testing root endpoint...')
    try:
        response = requests.get(f'{API_URL}/')
        data = response.json()
        print('Root endpoint response:', data)
    except Exception as e:
        print(f'Error testing root endpoint: {str(e)}')

def test_diseases():
    print('Testing diseases endpoint...')
    try:
        response = requests.get(f'{API_URL}/diseases')
        data = response.json()
        if data:
            first_item = list(data.items())[0]
            print('Diseases endpoint response (first item):', first_item)
        else:
            print('No data returned from diseases endpoint')
    except Exception as e:
        print(f'Error testing diseases endpoint: {str(e)}')

def test_predict():
    print('Testing predict endpoint...')
    try:
        data = {'symptoms': ['fever', 'cough']}
        response = requests.post(f'{API_URL}/predict', data=data)
        if response.ok:
            result = response.json()
            print('Predict endpoint response:', result)
        else:
            print(f'Server responded with status: {response.status_code}')
            print('Response text:', response.text)
    except Exception as e:
        print(f'Error testing predict endpoint: {str(e)}')

def run_tests():
    print('Starting API tests...')
    test_root()
    test_diseases()
    test_predict()
    print('Tests completed.')

if __name__ == '__main__':
    run_tests() 