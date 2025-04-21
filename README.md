# Health Detective - Indian Diseases Dataset

This repository contains a comprehensive dataset of Indian diseases, including their symptoms, precautions, and medications. The dataset is designed to be used with the Health Detective application to provide accurate disease information to users.

## Dataset Structure

The dataset is stored in JSON format with the following structure:

```json
{
  "Disease Name": {
    "description": "A detailed description of the disease",
    "symptoms": [
      "Symptom 1",
      "Symptom 2",
      "Symptom 3"
    ],
    "precautions": [
      "Precaution 1",
      "Precaution 2",
      "Precaution 3"
    ],
    "medications": [
      "Medication 1",
      "Medication 2",
      "Medication 3"
    ]
  }
}
```

## Files

- `backend/data/indian_diseases.json`: Contains the complete dataset of Indian diseases
- `backend/update_diseases.py`: Script to update the backend with the new disease data

## How to Use

1. Make sure you have the Health Detective application set up
2. Run the update script to merge the new diseases with the existing database:

```bash
cd backend
python update_diseases.py
```

The script will:
- Load the new diseases from `indian_diseases.json`
- Merge them with any existing diseases in `diseases.json`
- Save the updated dataset back to `diseases.json`

## Dataset Information

The dataset includes information about various Indian diseases, including:
- Common infectious diseases (Malaria, Dengue, Chikungunya, etc.)
- Water-borne diseases (Cholera, Typhoid, etc.)
- Vector-borne diseases
- Respiratory infections
- And many more

Each disease entry includes:
- A detailed description
- Common symptoms
- Recommended precautions
- Available medications

## Contributing

If you'd like to add more diseases or update the existing information, please:
1. Edit the `indian_diseases.json` file
2. Run the update script to merge your changes
3. Submit a pull request with your changes

## License

This dataset is provided under the MIT License. See the LICENSE file for details.