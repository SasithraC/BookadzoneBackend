import 'dotenv/config'
export const ENV ={
PORT:process.env.PORT || 5000,
MONGO_URI:process.env.MONGO_URI || "",
ADMIN_EMAIL:process.env.ADMIN_EMAIL || "",
JWT_SECRET:process.env.JWT_SECRET || "",
JWT_EXPIRE_TIME:process.env.JWT_EXPIRE_TIME || ""
}