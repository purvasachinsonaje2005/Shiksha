import joblib
import requests
import pandas as pd


# Replace this AFTER deploying your backend
API_URL = "https://your-backend-url/api/students/python-api?studentId="


# ---------------------------
# Mapping function
# ---------------------------
def map_student_to_model_format(student, application, number_of_absences):

    mapped = {
        "Age": student["age"],
        "Gender": student["gender"],
        "Address": student["address"],
        "Family_Size": student["familySize"],
        "Reason_for_Choosing_School": student["reasonForChoosingSchool"],
        "Internet_Access": student["internetAccess"],
        "Extra_Curricular_Activities": student["extraCurricularActivities"],
        "In_Relationship": student["inRelationship"],
        "Wants_Higher_Education": student["wantsHigherEducation"],

        "Family_Relationship": student["familyRelationship"],
        "Free_Time": student["freeTime"],
        "Going_Out": student["goingOut"],
        "Health_Status": student["healthStatus"],
        "Study_Time": student["studyTime"],
        "Travel_Time": student["travelTime"],
        "Weekend_Alcohol_Consumption": student["weekendAlcoholConsumption"],
        "Weekday_Alcohol_Consumption": student["weekdayAlcoholConsumption"],
        "Guardian": student["guardian"],
        "Attended_Nursery": student["attendedNursery"],
        "Extra_Paid_Class": student["extraPaidClasses"],
        "Family_Support": student["familySupport"],
        "Parental_Status": student["parentalStatus"],

        "Number_of_Failures": student["numberOfFailures"],

        "Final_Grade": student["finalGrade"],
        "Grade_1": student["grade1"],
        "Grade_2": student["grade2"],

        "Father_Education": student["father"]["educationLevel"],
        "Mother_Education": student["mother"]["educationLevel"],

        "Father_Job": student["father"]["occupation"],
        "Mother_Job": student["mother"]["occupation"],

        "Number_of_Absences": number_of_absences,
        "School_Support": application,
    }

    return mapped


# ---------------------------
# Prediction function
# ---------------------------
def analyze_student(student_id):

    try:
        response = requests.get(API_URL + student_id)

        if response.status_code != 200:
            return {"error": "Student not found"}

        data = response.json()

        student = data["student"]
        application = data["schoolSupport"]
        number_of_absences = data["numberOfAbsences"]

        input_row = map_student_to_model_format(
            student, application, number_of_absences
        )

        df = pd.DataFrame([input_row])

        # Load ML model
        model = joblib.load("python/dropout_predictor_pipeline.pkl")

        prediction = model.predict(df)[0]
        prob = model.predict_proba(df)[0][1]

        return {
            "dropout_prediction": int(prediction),
            "dropout_probability": float(prob),
            "student": input_row
        }

    except Exception as e:
        return {"error": str(e)}
