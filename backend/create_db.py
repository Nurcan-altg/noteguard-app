"""
Simple database creation script for SQLite
"""

import sqlite3
import uuid
from datetime import datetime

def create_database():
    """Create SQLite database with required tables"""
    
    # Connect to SQLite database (creates if not exists)
    conn = sqlite3.connect('noteguard.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email_verified BOOLEAN NOT NULL DEFAULT 0,
            email_verification_token TEXT,
            email_verification_expires DATETIME,
            password_reset_token TEXT,
            password_reset_expires DATETIME,
            is_active BOOLEAN NOT NULL DEFAULT 1,
            is_premium BOOLEAN NOT NULL DEFAULT 0,
            analysis_count INTEGER NOT NULL DEFAULT 0,
            last_login DATETIME,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )
    ''')
    
    # Create analyses table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            source_type TEXT NOT NULL,
            text_excerpt TEXT NOT NULL,
            full_text TEXT NOT NULL,
            reference_topic TEXT,
            overall_score REAL NOT NULL,
            grammar_score REAL NOT NULL,
            repetition_score REAL NOT NULL,
            semantic_score REAL NOT NULL,
            grammar_errors TEXT,
            repetition_errors TEXT,
            semantic_coherence TEXT,
            suggestions TEXT,
            processing_time REAL NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            request_id TEXT,
            user_agent TEXT,
            ip_address TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create files table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS files (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            analysis_id TEXT,
            filename TEXT NOT NULL,
            file_size REAL NOT NULL,
            mime_type TEXT NOT NULL,
            file_path TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (analysis_id) REFERENCES analyses (id)
        )
    ''')
    
    # Create indexes
    cursor.execute('CREATE INDEX IF NOT EXISTS ix_users_email ON users (email)')
    cursor.execute('CREATE INDEX IF NOT EXISTS ix_analyses_user_id ON analyses (user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS ix_files_user_id ON files (user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS ix_files_analysis_id ON files (analysis_id)')
    
    # Commit changes
    conn.commit()
    conn.close()
    
    print("Database created successfully!")

if __name__ == "__main__":
    create_database()
