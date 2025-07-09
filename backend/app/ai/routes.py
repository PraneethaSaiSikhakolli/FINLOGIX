from flask import Blueprint, jsonify, request, current_app,url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from ..models import Transaction,AudioNote
from ..extensions import db
import google.generativeai as genai
import os
import time

ai_bp = Blueprint('ai', __name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))  

@ai_bp.route('/advice', methods=['GET'])
@jwt_required()
def get_advice():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()

    summary = ""
    for t in transactions:
        category = t.category.name if t.category else "Uncategorized"
        summary += f"{t.type}: ₹{t.amount} on {category} - {t.note or 'No note'}\n"

    prompt = (
        "You're a smart, friendly budgeting assistant. "
        "Analyze the user's spending history below and provide short, actionable budgeting advice. "
        "Respond with 5-12 concise bullet points using clear and motivating language. "
        "Avoid over-explaining. Use emojis only at the start of each point.\n\n"
        f"{summary}"
    )

    model = genai.GenerativeModel('models/gemini-1.5-flash')
    response = model.generate_content(prompt)

    return jsonify({"advice": response.text.strip()})
