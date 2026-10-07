import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'portfolio_yves_yao',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function ensureRuntimeSchema() {
  await pool.query(`CREATE TABLE IF NOT EXISTS media_videos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    title_en VARCHAR(180) DEFAULT '',
    description TEXT,
    description_en TEXT,
    video_url VARCHAR(500) NOT NULL,
    poster_path VARCHAR(255) DEFAULT '',
    content_type ENUM('formation','publicite','seminaire') NOT NULL DEFAULT 'formation',
    published TINYINT(1) NOT NULL DEFAULT 1,
    view_count INT UNSIGNED NOT NULL DEFAULT 0,
    click_count INT UNSIGNED NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`);
  const columns = [
    ['media_videos', 'poster_path', "VARCHAR(255) DEFAULT '' AFTER video_url"],
    ['media_videos', 'view_count', 'INT UNSIGNED NOT NULL DEFAULT 0 AFTER published'],
    ['media_videos', 'click_count', 'INT UNSIGNED NOT NULL DEFAULT 0 AFTER view_count'],
    ['admins', 'role', "VARCHAR(20) NOT NULL DEFAULT 'admin' AFTER password_hash"],
    ['admins', 'active', 'TINYINT(1) NOT NULL DEFAULT 1 AFTER role']
  ];
  for (const [table, column, definition] of columns) {
    const [existing] = await pool.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [column]);
    if (!existing.length) await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
  }
  await pool.query(`CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL PRIMARY KEY,
    expires INT UNSIGNED NOT NULL,
    data MEDIUMTEXT,
    INDEX idx_sessions_expires (expires)
  ) ENGINE=InnoDB`);
  await pool.query(`CREATE TABLE IF NOT EXISTS login_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ip_hash CHAR(64) NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_login_attempts_ip_time (ip_hash, attempted_at)
  ) ENGINE=InnoDB`);
  await pool.query(`CREATE TABLE IF NOT EXISTS admin_activity (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id INT UNSIGNED NULL,
    action VARCHAR(120) NOT NULL,
    details VARCHAR(255) DEFAULT '',
    ip_hash CHAR(64) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_activity_created (created_at),
    CONSTRAINT fk_admin_activity_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
  ) ENGINE=InnoDB`);
  await pool.query(`CREATE TABLE IF NOT EXISTS interaction_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(40) NOT NULL,
    ip_hash CHAR(64) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_interaction_events_name_time (event_name, created_at)
  ) ENGINE=InnoDB`);
}
