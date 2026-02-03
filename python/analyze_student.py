import sys
import joblib
import requests
import json
import pandas as pd

API_URL = "http://localhost:3000/api/students/python-api?studentId="

# ---------------------------
# Mapping function
# ---------------------------
def map_student_to_model_format(student, application, number_of_absences):
    """Convert MongoDB student fields to ML dataset column names."""

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

        # Grades
        "Final_Grade": student["finalGrade"],
        "Grade_1": student["grade1"],
        "Grade_2": student["grade2"],

        # Parent Education
        "Father_Education": student["father"]["educationLevel"],
        "Mother_Education": student["mother"]["educationLevel"],

        # Parent Occupation (optional if model used them)
        "Father_Job": student["father"]["occupation"],
        "Mother_Job": student["mother"]["occupation"],
        "Number_of_Absences": number_of_absences,
        "School_Support": application,
    }

    return mapped


# ---------------------------
# Main function
# ---------------------------
def analyze_student(student_id):
    response = requests.get(API_URL + student_id)

    if response.status_code != 200:
        print("Error: Student not found")
        return

    student = response.json()["student"] 
    application = response.json()["schoolSupport"]
    number_of_absences = response.json()["numberOfAbsences"]

    input_row = map_student_to_model_format(student, application, number_of_absences)
    
    df = pd.DataFrame([input_row])
    df.to_csv("temp_student_data.csv", index=False)

    model = joblib.load("python/dropout_predictor_pipeline.pkl")
    prediction = model.predict(df)[0]
    prob = model.predict_proba(df)[0][1]
    
    print(json.dumps({
        "dropout_prediction": int(prediction),
        "dropout_probability": float(prob),
        "student":input_row
    }, indent=4))


# ---------------------------
# Entry point
# ---------------------------
if __name__ == "__main__":
    student_id = sys.argv[1]
    analyze_student(student_id) 
