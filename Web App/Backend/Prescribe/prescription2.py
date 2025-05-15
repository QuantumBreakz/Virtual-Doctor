import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ollama

# Load dataset
df = pd.read_csv("drugsComTest_raw.csv")
df = df[['drugName', 'condition', 'rating']].dropna()
df = df.sort_values(by='rating', ascending=False)  # Get highest-rated medicines

# TF-IDF Vectorizer to match user input to conditions
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df['condition'])

def find_condition(user_input):
    """
    Find the best-matching condition based on user input.
    """
    user_condition_tfidf = tfidf_vectorizer.transform([user_input])
    similarity_scores = cosine_similarity(user_condition_tfidf, tfidf_matrix)
    top_index = similarity_scores.argmax()  # Best match
    return df.iloc[top_index]['condition']

def get_best_medicine(condition):
    """
    Find the highest-rated medicine for a given condition.
    """
    condition_match = df[df['condition'].str.contains(condition, case=False, na=False)]
    return condition_match.iloc[0]['drugName'] if not condition_match.empty else None

def chat_with_patient():
    """
    Chatbot interaction that recommends medicine based on symptoms.
    """
    print("Doctor: Hello! What symptoms or condition are you experiencing?")
    user_input = input("You: ")

    # Find the most relevant condition
    condition = find_condition(user_input)

    if condition:
        print(f"Doctor: Based on your symptoms, you might have: {condition}")

        # Get the best-rated medicine
        recommended_medicine = get_best_medicine(condition)
        
        if recommended_medicine:
            print(f"Doctor: The best-rated medicine for {condition} is: {recommended_medicine}")

            # Get further advice from Llama 2
            advice_response = ollama.chat(model="llama2", messages=[
                {"role": "system", "content": "You are a medical assistant providing health advice."},
                {"role": "user", "content": f"What precautions should I take while using {recommended_medicine}?"}
            ])

            print(f"Doctor Advice: {advice_response['message']['content']}")
        else:
            print("Doctor: I couldn't find a recommended medicine. Please consult a doctor.")
    else:
        print("Doctor: I couldn't determine your condition. Please consult a doctor.")

# Run chatbot
chat_with_patient()
