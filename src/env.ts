const env = {
    DEBUG: process.env.DEBUG !== '0' && !!process.env.DEBUG,
    PORT: process.env.PORT || '3012',
    NODE_ENV: process.env.NODE_ENV || 'development',
    ISDEV: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
    ISTEST: process.env.NODE_ENV === 'test',
    ISSTAGING: process.env.NODE_ENV === 'qa' || process.env.NODE_ENV === 'staging',
    ISPROD: process.env.NODE_ENV === 'production',
    DB: process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/HeartPlus',
};

export default env;
