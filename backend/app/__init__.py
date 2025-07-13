#C:\Users\Sai\Desktop\FINLOGIC\backend\app\__init__.py
from flask import Flask,send_from_directory
from .extensions import db, migrate, socketio,jwt
from .config import Config
from .auth.routes import auth_bp
from .transactions.routes import txn_bp
from .ai.routes import ai_bp
from .audio.routes import audio_bp
from .admin.routes import admin_bp
from .users.routes import user_bp
from flask_cors import CORS
from sqlalchemy import inspect
import os
import mimetypes

  

def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    CORS(app, supports_credentials=True, origins=["http://localhost:5173","https://finlogix-three.vercel.app"])
    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)
    jwt.init_app(app)
    mimetypes.add_type('audio/webm', '.webm')

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(txn_bp, url_prefix='/transactions')
    app.register_blueprint(ai_bp, url_prefix='/ai')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(user_bp,url_prefix='/user')
    app.register_blueprint(audio_bp,url_prefix='/audio')
    @app.route('/static/uploads/<filename>')
    def serve_audio(filename):
        return send_from_directory('static/uploads', filename, mimetype='audio/webm')

    @app.route("/", strict_slashes=False)
    def home():
        return "✅ Welcome to FinLogix Backend!"



    # Safe category seeding
    from .models import Category
    with app.app_context():
        inspector = inspect(db.engine)
        if 'category' in inspector.get_table_names():
            if not Category.query.first():
                db.session.add_all([
                    Category(name="Food"),
                    Category(name="Rent"),
                    Category(name="Travel"),
                    Category(name="Utilities")
                ])
                db.session.commit()
                print("✅ Default categories seeded.")
        else:
            print("⚠️ Skipping category seeding – table not yet created.")

    return app
