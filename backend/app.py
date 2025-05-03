from flask import Flask, request, jsonify
import pandas as pd
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.sentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from flask_cors import CORS
import os

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Download necessary NLTK data
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

# Load dataset
filename = "../frontend/BooksDatasetClean.csv"  # Ensure this file is in the same directory on Render
df = pd.read_csv(filename)

# Standardize column names
df.columns = df.columns.str.lower().str.strip()
df.rename(columns={"title": "title", "authors": "author", "category": "genre", "description": "description"}, inplace=True)

# Ensure required columns exist
required_columns = ['title', 'author', 'genre', 'description']
for col in required_columns:
    if col not in df.columns:
        raise ValueError(f"Missing required column: {col}")

# Preprocess text data
df['description'] = df['description'].fillna("")
vectorizer = TfidfVectorizer(stop_words='english')
vectorizer.fit_transform(df['description'])

# Define functions for recommendations
def recommend_books_by_genre(genre, n=5):
    filtered_books = df[df['genre'].str.contains(genre, case=False, na=False)]
    if filtered_books.empty:
        return {"message": "No books found for the specified genre."}
    sampled_books = filtered_books[['title', 'author', 'genre']].sample(n=min(n, len(filtered_books))).to_dict(orient='records')
    return {"books": sampled_books}

def recommend_books_by_sentiment(text, n=5):
    sentiment_score = sia.polarity_scores(text)['compound']
    sentiment_category = "Positive" if sentiment_score >= 0.05 else "Negative" if sentiment_score <= -0.05 else "Neutral"
    
    emotion = TextBlob(text).sentiment.polarity
    genres_to_search = ["Fiction", "Adventure", "Romance"] if sentiment_category == "Positive" else ["Drama", "Mystery"]
    
    filtered_books = df[df['genre'].apply(lambda g: any(genre in str(g) for genre in genres_to_search))]
    if filtered_books.empty:
        return {"message": "No books found for the detected sentiment/emotion."}
    
    sampled_books = filtered_books[['title', 'author', 'genre']].sample(n=min(n, len(filtered_books))).to_dict(orient='records')
    return {"sentiment": sentiment_category, "books": sampled_books}

# Flask routes
@app.route("/recommend/genre", methods=["GET"])
def genre_recommendation():
    genre = request.args.get("genre", "")
    n = int(request.args.get("n", 5))
    return jsonify(recommend_books_by_genre(genre, n))

@app.route("/recommend/sentiment", methods=["POST"])
def sentiment_recommendation():
    data = request.json
    text = data.get("text", "")
    n = int(data.get("n", 5))
    return jsonify(recommend_books_by_sentiment(text, n))

# Run the app on the correct port for Render
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render provides the port
    app.run(host="0.0.0.0", port=port)
