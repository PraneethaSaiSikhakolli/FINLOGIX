from flask import Blueprint, request, jsonify
from ..models import User, Transaction, Category
from ..extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from datetime import timedelta,date

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# 🧠 Helper: Check if user is admin
def admin_required():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    return user and user.role == "admin"


# 📊 All users and their total spend
@admin_bp.route('/user-summaries', methods=['GET'])
@jwt_required(locations=["headers"])
def user_summaries():
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    summaries = db.session.query(
        Transaction.user_id,
        func.sum(Transaction.amount).label('total_spent')
    ).filter(Transaction.type == 'expense') \
     .group_by(Transaction.user_id).all()

    result = []
    for user_id, total in summaries:
        user = User.query.get(user_id)
        if user:
            result.append({
                "user_id": user.id,
                "email": user.email,
                "total_spent": total
            })

    return jsonify(result)

# 🚩 Flag top overspenders
@admin_bp.route('/overspenders', methods=['GET'])
@jwt_required(locations=["headers"])
def overspenders():
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    limit = float(request.args.get("limit", 10000))
    overspenders = db.session.query(
        Transaction.user_id,
        func.sum(Transaction.amount).label('total_spent')
    ).filter(Transaction.type == 'expense') \
     .group_by(Transaction.user_id).having(func.sum(Transaction.amount) > limit).all()

    result = []
    for user_id, total in overspenders:
        user = User.query.get(user_id)
        if user:
            result.append({
                "user_id": user.id,
                "email": user.email,
                "total_spent": total
            })

    return jsonify(result)

# 🗂️ Get all categories
@admin_bp.route('/categories', methods=['GET'])
@jwt_required(locations=["headers"])
def get_categories():
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    categories = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories])

# ➕ Add a new category
@admin_bp.route('/categories/add', methods=['POST'])
@jwt_required(locations=["headers"])
def add_category():
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"message": "Category name is required"}), 400

    if Category.query.filter_by(name=name).first():
        return jsonify({"message": "Category already exists"}), 409

    new_cat = Category(name=name)
    db.session.add(new_cat)
    db.session.commit()

    return jsonify({"message": "Category added", "id": new_cat.id}), 201

# ✏️ Update a category name
@admin_bp.route('/categories/update/<int:id>', methods=['PUT'])
@jwt_required(locations=["headers"])
def update_category(id):
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        return jsonify({"message": "New category name is required"}), 400

    category = Category.query.get(id)
    if not category:
        return jsonify({"message": "Category not found"}), 404

    if Category.query.filter_by(name=new_name).first():
        return jsonify({"message": "Category with this name already exists"}), 409

    category.name = new_name
    db.session.commit()

    return jsonify({"message": f"Category updated to '{new_name}'"}), 200


@admin_bp.route('/categories/delete/<int:id>', methods=['DELETE'])
@jwt_required(locations=["headers"])
def delete_category(id):
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    category = Category.query.get(id)
    if not category:
        return jsonify({"message": "Category not found"}), 404

    # Prevent deletion if category is linked to any transaction
    usage_count = Transaction.query.filter_by(category_id=category.id).count()
    if usage_count > 0:
        return jsonify({
            "message": f"Cannot delete category '{category.name}' — used in {usage_count} transactions"
        }), 400

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted"}), 200



# Get category usage statistics
@admin_bp.route('/categories/stats', methods=['GET'])
@jwt_required(locations=["headers"])
def category_stats():
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    usage = db.session.query(
        Transaction.category_id,
        func.count().label("count"),
        func.sum(Transaction.amount).label("total_spent")
    ).group_by(Transaction.category_id).all()

    result = []
    for cat_id, txn_count, total in usage:
        category = Category.query.get(cat_id)
        if category:
            result.append({
                "category": category.name,
                "transactions": txn_count,
                "total_spent": total
            })

    return jsonify(result), 200


from sqlalchemy import case

@admin_bp.route('/categories/summary', methods=['GET'])
@jwt_required(locations=["headers"])
def category_summary():
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    # Total spent
    total_spent = db.session.query(
        func.sum(Transaction.amount)
    ).filter(Transaction.type == 'expense').scalar() or 0

    # Total transactions
    total_txns = db.session.query(func.count()).scalar()

    # Most used category
    usage = db.session.query(
        Transaction.category_id,
        func.count().label("count")
    ).group_by(Transaction.category_id).order_by(func.count().desc()).first()

    top_category = None
    if usage:
        category = Category.query.get(usage.category_id)
        if category:
            top_category = category.name

    return jsonify({
        "total_spent": float(total_spent),
        "total_transactions": total_txns,
        "top_category": top_category or "N/A"
    }), 200


@admin_bp.route('/analytics-summary', methods=['GET'])
@jwt_required()
def analytics_summary():
    from ..models import User, Transaction

    total_users = User.query.count()
    total_txns = Transaction.query.count()

    today = date.today()
    active_today = db.session.query(Transaction.user_id).filter(
        func.date(Transaction.timestamp) == today
    ).distinct().count()

    return jsonify({
        'total_users': total_users,
        'transactions': total_txns,
        'active_today': active_today
    }), 200


@admin_bp.route('/analytics-trends', methods=['GET'])
@jwt_required()
def analytics_trends():
    from ..models import Transaction
    from datetime import timedelta

    today = date.today()
    trends = []

    for i in range(6, -1, -1):  
        day = today - timedelta(days=i)
        txns_count = db.session.query(Transaction).filter(
            func.date(Transaction.timestamp) == day
        ).count()

        trends.append({
            'day': day.strftime('%d-%b'),
            'users': 0,  
            'txns': txns_count
        })

    return jsonify(trends), 200


@admin_bp.route('/categories/type-breakdown', methods=['GET'])
@jwt_required(locations=["headers"])
def income_expense_by_category():
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    results = db.session.query(
        Transaction.category_id,
        Transaction.type,
        func.sum(Transaction.amount)
    ).group_by(Transaction.category_id, Transaction.type).all()

    data = {}
    for category_id, txn_type, total in results:
        category = Category.query.get(category_id)
        if not category:
            continue
        name = category.name
        if name not in data:
            data[name] = {"category": name, "income": 0, "expense": 0}
        data[name][txn_type] = float(total)

    return jsonify(list(data.values())), 200


@admin_bp.route('/dashboard/summary', methods=['GET'])
@jwt_required(locations=["headers"])
def admin_dashboard_summary():
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    total_users = db.session.query(User).count()

    # Active users = those who made any transaction in last 7 days
    from datetime import datetime, timedelta
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    active_user_ids = db.session.query(Transaction.user_id).filter(Transaction.timestamp >= one_week_ago).distinct()
    active_users = active_user_ids.count()

    category_count = db.session.query(Category).count()

    return jsonify({
        "total_users": total_users,
        "active_users": active_users,
        "category_count": category_count
    }), 200

@admin_bp.route('/user-list', methods=['GET'])
@jwt_required(locations=["headers"])
def user_list():
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    users = User.query.all()
    result = [{
        "id": u.id,
        "email": u.email,
        "role": u.role
    } for u in users]

    return jsonify(result), 200


# Promote user to admin
@admin_bp.route('/promote/<int:user_id>', methods=['POST'])
@jwt_required(locations=["headers"])
def promote_user(user_id):
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    if user.role == 'admin':
        return jsonify({"message": "User is already an admin"}), 200

    user.role = "admin"
    db.session.commit()

    return jsonify({"message": f"{user.email} promoted to admin."}), 200

# 🧑‍💼 List all admin users
@admin_bp.route('/list', methods=['GET'])
@jwt_required(locations=["headers"])
def list_admins():
    if not admin_required():
        return jsonify({"message": "Admins only"}), 403

    admins = User.query.filter_by(role="admin").all()
    return jsonify([{"id": admin.id, "email": admin.email} for admin in admins]), 200
