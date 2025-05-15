import pandas as pd
import ollama

# Load the dataset
df = pd.read_csv("drugsComTest_raw.csv")

# Clean the data: Drop NaN values and sort by highest-rated drugs
df = df.dropna(subset=["condition", "drugName", "rating"])
df = df.sort_values(by="rating", ascending=False)

def get_best_medicine(symptoms):
    """
    Find the most relevant condition and the best-rated drug.
    """
    for symptom in symptoms:
        condition_match = df[df["condition"].str.contains(symptom, case=False, na=False)]
        if not condition_match.empty:
            best_drug = condition_match.iloc[0]  # Top-rated drug
            return best_drug["condition"], best_drug["drugName"]
    
    return None, None  # No match found

def chat_with_patient():
    """
    Engage in conversation, extract symptoms, and recommend medicine.
    """
    print("Doctor: Hello! What symptoms are you experiencing?")
    user_input = input("You: ")

    # Use Llama 2 to analyze symptoms and suggest a condition
    response = ollama.chat(model="llama2", messages=[
        {"role": "system", "content": "You are a medical assistant helping patients identify diseases. You have to be brief in conversations."},
        {"role": "user", "content": f"I have these symptoms: {user_input}. What is the possible disease?"}
    ])
    
    predicted_disease = response['message']['content']
    print(f"Doctor: Based on your symptoms, you might have: {predicted_disease}")

    # Find the best medicine for the predicted condition
    condition, recommended_medicine = get_best_medicine([predicted_disease])
    
    if condition and recommended_medicine:
        print(f"Doctor: The best-rated medicine for {condition} is: {recommended_medicine}")

        # Ask Llama 2 for further advice
        advice_response = ollama.chat(model="llama2", messages=[
            {"role": "system", "content": "You are a medical assistant providing health advice."},
            {"role": "user", "content": f"What precautions should I take while using {recommended_medicine}?"}
        ])

        advice = advice_response['message']['content']
        print(f"Doctor Advice: {advice}")
    
    else:
        print("Doctor: I couldn't find a recommended medicine. Please consult a doctor.")

# Run the chatbot
chat_with_patient()
