from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Transaction, Category
from ..extensions import db, socketio

txn_bp = Blueprint('txn', __name__, url_prefix='/transactions')

# ➕ Add Transaction
@txn_bp.route('/add', methods=['POST'])
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()
    data = request.get_json()

    required_fields = ["amount", "type"]
    if not all(data.get(field) for field in required_fields):
        return jsonify({"message": "amount and type are required"}), 400

    if data["type"] == "expense":
        if not data.get("category_id"):
            return jsonify({"message": "category_id is required for expenses"}), 400
        category = Category.query.get(data["category_id"])
        if not category:
            return jsonify({"message": "Invalid category_id"}), 400
    else:
        category = Category.query.filter_by(name="Salary").first()

    transaction = Transaction(
        amount=data["amount"],
        type=data["type"],
        note=data.get("note"),
        user_id=user_id,
        category_id=category.id if category else None
    )

    db.session.add(transaction)
    db.session.commit()

    socketio.emit('transaction_update', {
        "event": "added",
        "user_id": user_id,
        "transaction": {
            "id": transaction.id,
            "amount": transaction.amount,
            "type": transaction.type,
            "category": {"id": category.id, "name": category.name},
            "note": transaction.note,
            "timestamp": transaction.timestamp.isoformat()
        }
    })

    return jsonify({"message": "Transaction added", "id": transaction.id}), 201


# ✏️ Edit Transaction
@txn_bp.route('/edit/<int:id>', methods=['PUT'])
@jwt_required()
def edit_transaction(id):
    user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=id, user_id=user_id).first()
    if not transaction:
        return jsonify({"message": "Transaction not found"}), 404

    data = request.get_json()

    if "category_id" in data:
        category = Category.query.get(data["category_id"])
        if not category:
            return jsonify({"message": "Invalid category_id"}), 400
        transaction.category_id = category.id

    transaction.amount = data.get("amount", transaction.amount)
    transaction.type = data.get("type", transaction.type)
    transaction.note = data.get("note", transaction.note)

    db.session.commit()

    socketio.emit('transaction_update', {
        "event": "edited",
        "user_id": user_id,
        "transaction": {
            "id": transaction.id,
            "amount": transaction.amount,
            "type": transaction.type,
            "category": {
                "id": transaction.category.id,
                "name": transaction.category.name
            },
            "note": transaction.note,
            "timestamp": transaction.timestamp.isoformat()
        }
    })

    return jsonify({"message": "Transaction updated successfully"}), 200


# ❌ Delete Transaction
@txn_bp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(id):
    user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=id, user_id=user_id).first()
    if not transaction:
        return jsonify({"message": "Transaction not found"}), 404

    deleted_id = transaction.id
    db.session.delete(transaction)
    db.session.commit()

    socketio.emit('transaction_update', {
        "event": "deleted",
        "user_id": user_id,
        "transaction": {"id": deleted_id}
    })

    return jsonify({"message": "Transaction deleted"}), 200


# 📄 List All Transactions
@txn_bp.route('/list', methods=['GET'])
@jwt_required()
def list_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.timestamp.desc()).all()

    result = [{
        "id": t.id,
        "amount": t.amount,
        "type": t.type,
        "category": {
            "id": t.category.id,
            "name": t.category.name
        },
        "note": t.note,
        "timestamp": t.timestamp.isoformat()
    } for t in transactions]

    return jsonify(result), 200
