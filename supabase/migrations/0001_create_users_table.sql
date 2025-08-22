CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    last_login TIMESTAMPTZ
);
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    last_login TIMESTAMPTZ
);
