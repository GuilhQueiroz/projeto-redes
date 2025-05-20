-- Cria o banco de dados
CREATE DATABASE IF NOT EXISTS redes_blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE redes_blog;

-- (Opcional) Cria um usuário e dá permissão (ajuste conforme necessário)
-- CREATE USER 'redes_user'@'localhost' IDENTIFIED BY 'sua_senha';
-- GRANT ALL PRIVILEGES ON redes_blog.* TO 'redes_user'@'localhost';
-- FLUSH PRIVILEGES;