from flask import Blueprint, jsonify,request
from flask_jwt_extended import jwt_required,get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from ..models import Category,User
from ..extensions import db

user_bp = Blueprint('user', __name__, url_prefix='/user')

@user_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories])


@user_bp.route('/user-details')
@jwt_required()
def get_user_details():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "id": user.id,
            "email": user.email,
            "role": user.role
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@user_bp.route('/by-email/<path:email>')
@jwt_required()
def get_user_by_email(email):
    try:
        user = User.query.filter_by(email=email.lower()).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        return jsonify({"id": user.id, "email": user.email, "role": user.role}), 200
    except Exception as e:
        print("💥 Internal Server Error:", e)
        return jsonify({"message": "Internal server error"}), 500


@user_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    data = request.get_json()
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        return jsonify({"error": "Both current and new passwords are required"}), 400

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not check_password_hash(user.password, old_password):
        return jsonify({"error": "Incorrect current password"}), 401

    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "Password changed successfully"}), 200


