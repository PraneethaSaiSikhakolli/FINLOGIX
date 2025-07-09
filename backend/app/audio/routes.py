from flask import Blueprint, jsonify, request,url_for,current_app
from flask_jwt_extended import jwt_required,get_jwt_identity
from ..models import AudioNote
from ..extensions import db
from werkzeug.utils import secure_filename
import os
import time

audio_bp = Blueprint('audio', __name__)

@audio_bp.route('/delete/<int:transaction_id>', methods=['DELETE'])
@jwt_required()
def delete_audio(transaction_id):
    audio = AudioNote.query.filter_by(transaction_id=transaction_id).first()
    if not audio:
        return jsonify({"message": "Audio memo not found"}), 404

    try:
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], os.path.basename(audio.url))
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        return jsonify({"message": "Failed to delete audio file", "error": str(e)}), 500

    db.session.delete(audio)
    db.session.commit()
    return jsonify({"message": "Audio memo deleted"}), 200

@audio_bp.route('/get/<int:transaction_id>', methods=['GET'])
@jwt_required()
def get_audio(transaction_id):
    audio = AudioNote.query.filter_by(transaction_id=transaction_id).first()
    if not audio:
        return jsonify({"url": None}), 404

    full_url = request.host_url.rstrip('/') + audio.url
    return jsonify({"url": full_url}), 200


@audio_bp.route('/upload/<int:transaction_id>', methods=['POST'])
@jwt_required()
def upload_audio(transaction_id):
    user_id = get_jwt_identity()
    file = request.files.get('audio')

    if not file:
        return jsonify({"msg": "No audio file provided"}), 400


    filename = secure_filename(f"{transaction_id}.webm")
    upload_folder = current_app.config['UPLOAD_FOLDER']
    path = os.path.join(upload_folder, filename)
    file.save(path)

    url = url_for('static', filename=f"uploads/{filename}", _external=True)

    audio = AudioNote.query.filter_by(transaction_id=transaction_id).first()
    if audio:
        # ✅ overwrite old URL no matter what
        old_path = os.path.join(upload_folder, os.path.basename(audio.url))
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
            except Exception as e:
                return jsonify({"msg": "Failed to delete old audio", "error": str(e)}), 500
        audio.url = url 
    else:
        audio = AudioNote(url=url, transaction_id=transaction_id)
        db.session.add(audio)

    db.session.commit()
    return jsonify({"url": url}), 200




@audio_bp.route('/list', methods=['GET'])
@jwt_required()
def list_audio_transaction_ids():
    user_id = get_jwt_identity()

    audio_notes = AudioNote.query.all()
    txn_ids = [audio.transaction_id for audio in audio_notes]

    return jsonify({"ids": txn_ids}), 200

