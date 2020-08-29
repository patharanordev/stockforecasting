SELECT 'CREATE DATABASE stock' 
WHERE NOT EXISTS (SELECT * FROM pg_database WHERE datname = 'stock');

CREATE TABLE IF NOT EXISTS stock_daily (
    on_date varchar(20) NOT NULL,
    stock_name varchar(10) NOT NULL,
    price_close real NOT NULL DEFAULT 0.0,
    price_open real NOT NULL DEFAULT 0.0,
    price_high real NOT NULL DEFAULT 0.0,
    price_low real NOT NULL DEFAULT 0.0,
    volume varchar(15) NOT NULL
);
CREATE UNIQUE INDEX idx_stock_daily ON stock_daily (on_date, stock_name);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uid varchar(50) NOT NULL, 
    email varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    address1 varchar(255) NOT NULL,
    address2 varchar(255) NOT NULL,
    address3 varchar(255) NOT NULL,
    phone varchar(255) NOT NULL,
    role varchar(50) NOT NULL,
    verified integer NOT NULL,
    created_date varchar(20) NOT NULL,
    updated_date varchar(20) NOT NULL
);
CREATE UNIQUE INDEX idx_users ON users (uid);

CREATE TABLE IF NOT EXISTS prediction (
    pid SERIAL PRIMARY KEY,
    stock_name varchar(10) NOT NULL,
    predict_on varchar(20) NOT NULL,
    predict_price real NOT NULL DEFAULT 0.0,
    test_send_order varchar(5) NOT NULL,
    target_date varchar(20) NOT NULL,
    real_close_price real NOT NULL DEFAULT 0.0,
    result integer NOT NULL DEFAULT -1,
    created_date varchar(20) NOT NULL,
    updated_date varchar(20) NOT NULL
);