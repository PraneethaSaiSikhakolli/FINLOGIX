from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
migrate = Migrate()
socketio = SocketIO(cors_allowed_origins="*")
jwt=JWTManager()