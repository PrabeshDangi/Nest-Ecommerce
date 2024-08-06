export default()=>({
    database:{
        connectionString:process.env.DATABASE_URL
    },
    secret:{
        jwtsecret:process.env.jwtsecret
    },
    port:process.env.PORT
});