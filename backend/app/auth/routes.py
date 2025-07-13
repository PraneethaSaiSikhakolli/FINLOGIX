#finlogic/backend/app/auth/routes.py
from flask import Blueprint, request, jsonify
from ..models import User
from ..extensions import db
from flask_jwt_extended import create_access_token,set_refresh_cookies, jwt_required,unset_jwt_cookies,create_refresh_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email").strip().lower()
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 409

    hashed_password = generate_password_hash(password)
    user = User(email=email, password=hashed_password, role='user')
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email").strip().lower()
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404   

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect password"}), 401  

    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    refresh_token = create_refresh_token(identity=str(user.id))
    response = jsonify(access_token=access_token)
    set_refresh_cookies(response, refresh_token)
    return response

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    # Logic to send reset email or token
    return jsonify({'message': 'Reset link sent'}), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
        "role": user.role
    }), 200


@auth_bp.route('/check-email', methods=['GET'])
def check_email():
    try:
        email = request.args.get("email", "").strip().lower()

        if not email:
            return jsonify({"available": False, "error": "Email is required"}), 400

        user = User.query.filter_by(email=email).first()
        return jsonify({"available": user is None}), 200

    except Exception as e:
        return jsonify({"available": False, "error": "Internal Server Error"}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    user = User.query.get(int(identity))
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )
    response = jsonify({"access_token": access_token})
    return response

@auth_bp.route('/logout',methods=['POST'])
def logout():
    response=jsonify(message="Logout successful")
    unset_jwt_cookies(response)
    return response